import database as db
import peewee as pw

IMG_DIR = "../ideaPoolData/ideaImg/"
NUM_OF_BLOCKS = 21

class ideas(db.MySQLModel):
    id = pw.PrimaryKeyField()
    title = pw.CharField()
    description = pw.TextField()
    owner = pw.CharField()
    img = pw.CharField()

def getIdeaById(ideaId):
    idea = ideas.get(ideas.id == ideaId)
    return idea

def createIdeaMsg(idea):
    msg = {'id':idea.id, 'title':idea.title, 'description':idea.description, 'owner':idea.owner, 'img':""}
    f = open(idea.img, 'r')
    msg['img'] = f.read()
    return msg
    
def getLatestIdeas():
    ideaQuery = ideas.select().order_by(ideas.id.desc())
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt >= NUM_OF_BLOCKS:
            break
        ideaList.append(idea)
        cnt+=1
    return ideaList

def create(title, description, owner, imgUrl):
    newIdea = ideas.create(title=title, description=description, owner=owner)
    imgName = "idea_"+str(newIdea.id)
    newIdea.img = saveImgUrlAsFile(imgUrl, imgName)
    newIdea.save()
    return newIdea

def saveImgUrlAsFile(imgUrl, imgName):
    imgLoc = IMG_DIR + imgName + ".txt";
    fw = open(imgLoc, "w+")
    fw.write(imgUrl)
    return imgLoc