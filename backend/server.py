import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from lib import idea
from lib import database

clients = []

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
    clients.append(self)

  def on_message(self, message):        
    #print message
    msg = json.loads(message)
    newIdea = idea.create(msg["title"], msg["description"], msg["owner"], msg["img"])
    oldIdea = idea.ideas.get(idea.ideas.id==newIdea.id)
    newMsg = {'title':oldIdea.title, 'description':oldIdea.description, 'owner':oldIdea.owner, 'img':""}
    f = open(oldIdea.img, 'r')
    newMsg['img'] = f.read()
    for client in clients:
  		client.write_message(newMsg)
        
  def on_close(self):
  	clients.remove(self)

app = tornado.web.Application(
	[
	(r'/submitIdea', WebSocketSubmitIdeaHandler), 
	(r'/', IndexHandler),
	(r'/showIdea', ShowIdeaHandler)
	]
)

app.listen(8080)
tornado.ioloop.IOLoop.instance().start()