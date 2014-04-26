import database as db
import peewee as pw

IMG_DIR = "../ideaPoolData/ideaImg/"

class ideas(db.MySQLModel):
    id = pw.PrimaryKeyField()
    title = pw.CharField()
    description = pw.TextField()
    owner = pw.CharField()
    img = pw.CharField()


def create(title, description, owner, imgUrl):
    newIdea = ideas.create(title=title, description=description, owner=owner)
    #newIdea.title = title
    #newIdea.description = description
    #newIdea.owner = owner
    imgName = "idea_"+str(newIdea.id)
    newIdea.img = saveImgUrlAsFile(imgUrl, imgName)
    newIdea.save()
    return newIdea

def saveImgUrlAsFile(imgUrl, imgName):
    imgLoc = IMG_DIR + imgName + ".txt";
    fw = open(imgLoc, "w+")
    fw.write(imgUrl)
    return imgLoc