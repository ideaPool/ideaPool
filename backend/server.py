import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import random
from lib import idea as IDEA
from lib import wall as WALL
from lib import database
from lib import login as LOGIN
from lib import ideaBuffer as IDEA_BUFFER
from lib import ideaInWall as IDEA_IN_WALL
from lib import userLogTag as USER_LOG_TAG

loginClients = {}
showIdeaClients = []
showWallClients = []
ideaList = []

class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render("index.html")

class ShowIdeaHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(request):
        request.render("showIdea.html")

class WebSocketSubmitIdeaHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketSubmitIdeaHandler")
        
    def on_message(self, message):
        msg = json.loads(message)
        tar = msg['tar']
        print("submit tar", msg['tar'])
        if tar == "submitIdea" :
            idea = msg['idea']
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            print user
            newIdea = IDEA.create(idea["title"], idea["description"],user['name'], user['id'], idea["img"], idea["privacy"])
            # update latest idea to all clientss
            for client in showIdeaClients: 
                client.loadInfo('getLatest')
    def on_close(self):
        pass

class WebSocketSubmitWallHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketSubmitWallHandler")
        
    def on_message(self, message):
        msg = json.loads(message)
        tar = msg['tar']
        print("submit tar", msg['tar'])
        if tar == "submitWall" :
            wall = msg['wall']
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            print user
            newWall = WALL.create(wall["title"], wall["description"], user['id'], wall["privacy"])
            # update latest idea to all clientss
            for client in showWallClients: 
                client.loadWall('getLatest')
            print wall["description"]       
    def on_close(self):
        pass 




class WebSocketShowIdeaHandler(tornado.websocket.WebSocketHandler):
    msg = {}
    def open(self, *args):
        print("open", "WebSocketShowIdeaHandler")
        showIdeaClients.append(self)
        self.msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(self.msg))

    def on_message(self, message):        
        self.msg = json.loads(message)
        tar = self.msg['tar']
        if tar == "loadInfo" :
            self.loadInfo('getLatest')
        elif tar == "loadMyInfo":
            self.loadInfo('self')
        elif tar == "loadRandInfo":
            self.loadInfo('rand')
        elif tar == "searchIdea":
            self.loadInfo('search')
        elif tar == "delIdea":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            IDEA.delIdea(self.msg['ideaId'], user['id']);
            print "delIdea!"
            for client in showIdeaClients: 
                client.loadInfo('getLatest')
        
    def on_close(self):
        showIdeaClients.remove(self)
        
    def loadInfo(self, algo):
        ideaList = []
        if algo == "getLatest":
            ideaList = IDEA.getLatestIdeas()
        elif algo == "self":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            ideaList = IDEA.getMyIdeas(user['id'])
        elif algo == "rand":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            if "showMyIdea" in self.msg['url']:
                ideaList = IDEA.getRandMyIdeas(user['id'])
            else:
                lottery = random.randint(0, 5)
                if lottery == 0:
                    ideaList = IDEA.getRandIdeas()
                elif lottery == 1:
                    ideaList = IDEA.getHottestIdeas()
                else:
                    user = LOGIN.getFbUserInfo(self.msg['accessToken'])
                    ideaList = IDEA.getRecommendIdeas(user['id'])
        elif algo == "search":
            key = self.msg['searchKey']
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            ideaList = IDEA.searchIdeas(self.msg['searchKey'])
            if key :
                print "add userLogTag : ", key
                USER_LOG_TAG.add(user['id'], key)
        
        self.msg = {'tar':"sendIdea", 'ideas': [], 'algo':algo }
        for idea in ideaList:
            self.msg['ideas'].append( IDEA.createIdeaMsg(idea) )
        data = json.dumps(self.msg)
        self.write_message(data)


class WebSocketShowWallHandler(tornado.websocket.WebSocketHandler):
    msg = {}
    def open(self, *args):
        print("open", "WebSocketShowWallHandler")
        showWallClients.append(self)
        self.msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(self.msg))

    def on_message(self, message):        
        self.msg = json.loads(message) 
        tar = self.msg['tar']
        if tar == "loadWall" :
            self.loadWall('getLatest')
        elif tar == "loadMyWall" :
            self.loadWall('self')
        elif tar == "searchWall" :
            self.loadWall('search')
        elif tar == "delWall":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            WALL.delWall(self.msg['wallId'], user['id']);
            print "delIdea!"
            self.broadcast('getLatest')
        elif tar == "putIdeaInWall":
            print "put idea in wall!"
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            wall = WALL.getWallById(self.msg['wallId'])
            if wall is not None and wall.ownerId == user['id']:
                IDEA_IN_WALL.add(self.msg['ideaId'], self.msg['wallId'])
                self.broadcast('getLatest')
            else:
                print "the wall might not be there or it's not Ur wall!"
        elif tar == "delIdeaInWall":
            print "del idea in wall!"
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            wall = WALL.getWallById(self.msg['wallId'])
            if wall is not None and wall.ownerId == user['id']:
                IDEA_IN_WALL.delete(self.msg['ideaId'], self.msg['wallId'])
                self.broadcast('getLatest')
            else:
                print "the wall might not be there or it's not Ur wall!"
                
    def on_close(self):
        showWallClients.remove(self)
        
    def broadcast(self, algo):
        for client in showWallClients: 
                client.loadWall(algo)
    
    def loadWall(self, algo):
        if algo == "getLatest":
            wallList = WALL.getLatestWalls()
        elif algo == "self":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            wallList = WALL.getMyWalls(user['id'])
        elif algo == "search":
            wallList = WALL.searchWalls(self.msg['searchKey'])
            print "search wall done!"
        self.msg = {'tar':"sendWall", 'walls': [], 'algo':algo }
        for wall in wallList:
            wallMsg = WALL.createWallMsg(wall)
            wallIdeaList = IDEA_IN_WALL.getAllWallIdea(wall.id)
            wallMsg['ideaList'] = []
            for idea in wallIdeaList:
                wallMsg['ideaList'].append(IDEA.createIdeaMsg(idea))
            self.msg['walls'].append( wallMsg )
        data = json.dumps(self.msg)
        self.write_message(data)



class WebSocketBufferHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketBufferHandler")
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message)
        tar = msg['tar']
        if tar == "signBuffer":
            if loginCLients[msg['accessToken']] is not None:
                loginCLients[msg['accessToken']]['wsBuffHandler'] = self
                msg = {'tar':"signSuccess" }
                self.write_message(json.dumps(msg))
            else:
                print("sign failed")
        elif tar == "loadBuffer" :
            self.loadBuffer(msg['accessToken'])
        elif tar == "bufferIdea":
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            IDEA_BUFFER.add(msg['ideaId'], user['id']) 
            self.loadBuffer(msg['accessToken'])
        elif tar=="delBuffIdea":
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            IDEA_BUFFER.delete(msg['ideaId'], user['id'])
            self.loadBuffer(msg['accessToken'])
            
    def loadBuffer(self, accessToken):
        user = LOGIN.getFbUserInfo(accessToken)
        buffList = IDEA_BUFFER.getAllBuff(user['id'])
        msg = {'tar':"sendBuff", 'buff':[]}
        for idea in buffList:
            msg['buff'].append(IDEA.createIdeaMsg(idea))
        self.write_message(json.dumps(msg))
            
    def on_close(self):
        pass
    
    
class WebSocketLoginHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketLoginHandler")
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message)
        tar = msg['tar']
        if tar == "userLogin" :
            LOGIN.userLogin(msg)
            print "userLogin"
        
    def on_close(self):
        pass

class WebSocketAnIdeaHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketAnIdeaHandler")
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message)
        tar = msg['tar']
        if tar == "loadAnIdea" :
            self.loadIdea(msg['id'])
        
    def on_close(self):
        pass
    def loadIdea(self, id):
        idea = IDEA.getIdeaById(id)
        if idea is not None:
            msg = {'tar': 'sendAnIdea'}
            msg['idea'] = IDEA.createIdeaMsg(idea)
            self.write_message(json.dumps(msg))
     
app = tornado.web.Application(
	[
	(r'/showIdea', WebSocketShowIdeaHandler),
	(r'/showWall', WebSocketShowWallHandler),
	(r'/submitIdea', WebSocketSubmitIdeaHandler),
	(r'/submitWall', WebSocketSubmitWallHandler),
	(r'/login', WebSocketLoginHandler),
	(r'/buffer', WebSocketBufferHandler),
	(r'/anIdea', WebSocketAnIdeaHandler),
	(r'/', IndexHandler)
	],
	debug=True,
)


app.listen(8080)
tornado.ioloop.IOLoop.instance().start()