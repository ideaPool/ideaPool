import database as db
import peewee as pw

IMG_DIR = "../ideaPoolData/ideaImg/"
NUM_OF_BLOCKS = 21

class ideas(db.MySQLModel):
    id = pw.PrimaryKeyField()
    title = pw.CharField()
    description = pw.TextField()
    owner = pw.CharField()
    ownerId = pw.CharField()
    img = pw.CharField()
    privacy = pw.CharField()
    linkNum = pw.IntegerField()

def getIdeaById(ideaId):
    try:
        idea = ideas.get(ideas.id == ideaId)
        return idea
    except ideas.DoesNotExist:
        return None

def delIdea(ideaId, userId):
    try:
        idea = ideas.get( (ideas.id==ideaId) & (ideas.ownerId==userId) )
        if idea.linkNum == 1:
            idea.delete_instance()
        else:
            idea.linkNum -= 1
            idea.owner = 'Public'
            idea.ownerId = '0'
            idea.save()
        return idea
    except ideas.DoesNotExist:
        print "idea not exist!!"
        return None
        
def createIdeaMsg(idea):
    msg = {'id':idea.id, 'title':idea.title, 'description':idea.description, 'owner':idea.owner, 'ownerId':idea.ownerId, 'privacy':idea.privacy, 'img':""}
    f = open(idea.img, 'r')
    msg['img'] = f.read()
    return msg
    
def getLatestIdeas():
    ideaQuery = ideas.select().where(ideas.privacy=="public").order_by(ideas.id.desc())
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt >= NUM_OF_BLOCKS:
            break
        ideaList.append(idea)
        cnt+=1
    return ideaList

def create(title, description, owner, ownerId, imgUrl, privacy):
    newIdea = ideas.create(title=title, description=description, owner=owner, ownerId=ownerId, privacy=privacy)
    imgName = "idea_"+str(newIdea.id)
    newIdea.img = saveImgUrlAsFile(imgUrl, imgName)
    newIdea.save()
    return newIdea

def saveImgUrlAsFile(imgUrl, imgName):
    imgLoc = IMG_DIR + imgName + ".txt";
    fw = open(imgLoc, "w+")
    fw.write(imgUrl)
    return imgLoc