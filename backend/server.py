import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from lib import idea as IDEA
from lib import database
from lib import login as LOGIN
from lib import ideaBuffer as IDEA_BUFFER

submitIdeaClients = []
showIdeaClients = []
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
    submitIdeaClients.append(self)

  def on_message(self, message):        
    #print message
    print "on message!"
    msg = json.loads(message)
    print msg['title']
    newIdea = IDEA.create(msg["title"], msg["description"], msg["owner"], msg["img"])
    oldIdea = IDEA.ideas.get(IDEA.ideas.id==newIdea.id)
    newMsg = {'title':oldIdea.title, 'description':oldIdea.description, 'owner':oldIdea.owner, 'img':""}
    f = open(oldIdea.img, 'r')
    newMsg['img'] = f.read()
    for client in showIdeaClients:
        newMsg['tar'] = "sendIdea"
        data = json.dumps(newMsg)
        client.write_message(data)
    for client in submitIdeaClients:
        data = json.dumps(newMsg)
        client.write_message(data)
        
  def on_close(self):
  	submitIdeaClients.remove(self)

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
            self.loadInfo()
        
    def on_close(self):
        showIdeaClients.remove(self)
    def loadInfo(self):
        ideaList = IDEA.getLatestIdeas()
        msg = {'tar':"sendIdea", 'ideas': [] }
        for idea in ideaList:
            msg['ideas'].append( IDEA.createIdeaMsg(idea) )
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
        if tar == "loadBuffer" :
            pass
        elif tar == "bufferIdea":
            print "get buffer idea req"
            self.bufferIdea(msg['ideaId'], msg['userId'])
            
    def on_close(self):
        pass
    
    def bufferIdea(self, ideaId, userId):
        print "add buffer!"
        IDEA_BUFFER.add(ideaId, userId)
    def getBufferIdeas(self):
        allBuffIdeas = IDEA_BUFFER.getAll()
        return allBuffIdeas
    
class WebSocketLoginHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        print("open", "WebSocketLoginHandler")
        msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(msg))

    def on_message(self, message):        
        msg = json.loads(message)
        tar = msg['tar']
        if tar == "userLogin" :
            self.checkAndSaveUser(msg)
        
    def on_close(self):
        pass
    def checkAndSaveUser(self, msg):
        print "check and save user!"
        LOGIN.checkAndSaveUser(msg);
     
app = tornado.web.Application(
	[
	(r'/showIdea', WebSocketShowIdeaHandler), 
	(r'/submitIdea', WebSocketSubmitIdeaHandler), 
	(r'/login', WebSocketLoginHandler),
	(r'/buffer', WebSocketBufferHandler),
	(r'/', IndexHandler)
	],
	debug=True,
)

app.listen(8080)
tornado.ioloop.IOLoop.instance().start()