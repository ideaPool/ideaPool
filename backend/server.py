import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from lib import idea as IDEA
from lib import wall as WALL
from lib import database
from lib import login as LOGIN
from lib import ideaBuffer as IDEA_BUFFER
from lib import ideaInWall as IDEA_IN_WALL

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
            newWall = WALL.create(wall["title"], wall["description"],user['name'], user['id'], wall["img"], wall["privacy"])
            # update latest idea to all clientss
            for client in showWallClients: 
                client.loadInfo('getLatest')
            print wall["description"]       
    def on_close(self):
        pass 




class WebSocketShowIdeaHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketShowIdeaHandler")
        showIdeaClients.append(self)
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message)
        tar = msg['tar']
        if tar == "loadInfo" :
            self.loadInfo('getLatest')
        elif tar == "delIdea":
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            IDEA.delIdea(msg['ideaId'], user['id']);
            print "delIdea!"
            for client in showIdeaClients: 
                client.loadInfo('getLatest')
        
    def on_close(self):
        showIdeaClients.remove(self)
    def loadInfo(self, algo):
        ideaList = IDEA.getLatestIdeas()
        msg = {'tar':"sendIdea", 'ideas': [], 'algo':algo }
        for idea in ideaList:
            msg['ideas'].append( IDEA.createIdeaMsg(idea) )
        data = json.dumps(msg)
        self.write_message(data)


class WebSocketShowWallHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketShowWallHandler")
        showWallClients.append(self)
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message) 
        tar = msg['tar']
        if tar == "loadWall" :
            self.loadWall('getLatest')
        elif tar == "delWall":
            user = LOGIN.getFbUserInfo(msg['accessToken'])
            WALL.delWall(msg['wallId'], user['id']);
            print "delIdea!"
            for client in showWallClients: 
                client.loadWall('getLatest')
            
    def on_close(self):
        showWallClients.remove(self)
    
    def loadWall(self, algo):
        wallList = WALL.getLatestWalls()
        msg = {'tar':"sendWall", 'walls': [], 'algo':algo }
        for wall in wallList:
            wallMsg = WALL.createWallMsg(wall)
            wallIdeaList = IDEA_IN_WALL.getAllWallIdea(wall.id)
            wallMsg['ideaList'] = []
            for idea in wallIdeaList:
                wallMsg['ideaList'].append(IDEA.createIdeaMsg(idea))
            msg['walls'].append( wallMsg )
        data = json.dumps(msg)
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

     
app = tornado.web.Application(
	[
	(r'/showIdea', WebSocketShowIdeaHandler),
	(r'/showWall', WebSocketShowWallHandler),
	(r'/submitIdea', WebSocketSubmitIdeaHandler),
	(r'/submitWall', WebSocketSubmitWallHandler),
	(r'/login', WebSocketLoginHandler),
	(r'/buffer', WebSocketBufferHandler),
	(r'/', IndexHandler)
	],
	debug=True,
)


app.listen(8080)
tornado.ioloop.IOLoop.instance().start()