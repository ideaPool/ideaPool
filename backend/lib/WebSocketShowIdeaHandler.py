

class WebSocketShowIdeaHandler(tornado.websocket.WebSocketHandler):
    msg = {}
    def open(self, *args):
        print("open", "WebSocketShowIdeaHandler")
        showIdeaClients.append(self)
        self.msg = {'tar': "connectSuccess"}
        self.write_message(json.dumps(self.msg))

    def on_message(self, message):        
        self.msg = json.loads(message)
        if "showIdea" in self.msg['url']:
            self.dealShowIdea()
        else if "showMyIdea" in self.msg['url']:
            self.dealShowMyIdea()
        else:
            print("404 error!")
        
    def on_close(self):
        showIdeaClients.remove(self)
    
    def dealShowIdea(self):
        tar = self.msg['tar']
        if tar == "loadInfo" :
            self.loadInfo('getLatest')
        elif tar == "loadRandInfo":
            self.loadInfo('rand')
        elif tar == "searchIdea":
            self.loadInfo('search')
        elif tar == "delIdea":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            IDEA.delIdea(self.msg['ideaId'], user['id']);
            print "delIdea!"
            self.broadcast('self')
    
    def dealShowMyIdea(self):
        tar = self.msg['tar']
        if tar == "loadInfo" :
            self.loadInfo('self')
        elif tar == "loadRandInfo":
            self.loadInfo('self')
        elif tar == "searchIdea":
            self.loadInfo('search')
        elif tar == "delIdea":
            user = LOGIN.getFbUserInfo(self.msg['accessToken'])
            IDEA.delIdea(self.msg['ideaId'], user['id']);
            print "delIdea!"
            self.broadcast('self')
            
    def broadcast(self, algo):
        for client in showIdeaClients: 
                client.loadInfo(algo)
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