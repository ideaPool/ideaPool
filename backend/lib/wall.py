import database as db
import peewee as pw
import ideaInWall as IDEA_IN_WALL

MAX_SHOW_NUM = 15

class walls(db.MySQLModel):
    id = pw.PrimaryKeyField()
    title = pw.CharField()
    description = pw.TextField()
    ownerId = pw.CharField()
    privacy = pw.CharField()

def getWallById(wallId):
    wall = walls.get(walls.id == wallId)
    return wall

def createWallMsg(wall):
    msg = {'id':wall.id, 'title':wall.title, 'description':wall.description, 'ownerId':wall.ownerId, 'privacy':wall.privacy}
    return msg
    
def getLatestWalls():
    query = walls.select().where(walls.privacy=="public").order_by(walls.id.desc())
    wallList = []
    cnt = 0
    for wall in query:
        if cnt >= MAX_SHOW_NUM:
            break
        wallList.append(wall)
        cnt+=1
    return wallList

def create(title, description, ownerId, imgUrl, privacy):
    newWall = walls.create(title=title, description=description, ownerId=ownerId, privacy=privacy)
    newWall.save()
    return newWall

def delWall(wallId, userId):
    try:
        wall = walls.get( (walls.id==wallId) & (walls.ownerId==userId) )
        IDEA_IN_WALL.delWall(wallId)
        wall.delete_instance()
        return wall
    except walls.DoesNotExist:
        print "wall not exist!!"
        return None