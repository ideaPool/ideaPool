import database as db
import peewee as pw
import ideaInWall as IDEA_IN_WALL
import idea as IDEA

MAX_SHOW_NUM = 15

class walls(db.MySQLModel):
    id = pw.PrimaryKeyField()
    title = pw.CharField()
    description = pw.TextField()
    ownerId = pw.CharField()
    privacy = pw.CharField()

def getWallById(wallId):
    try:
        wall = walls.get(walls.id == wallId)
        return wall
    except walls.DoesNotExist:
        return None

def createWallMsg(wall):
    msg = {'id':wall.id, 'title':wall.title, 'description':wall.description, 'ownerId':wall.ownerId, 'privacy':wall.privacy}
    return msg
    
def getLatestWalls():
    query = walls.select().where(walls.privacy=="public").order_by(walls.id.desc()).limit(MAX_SHOW_NUM)
    wallList = []
    cnt = 0
    for wall in query:
        if cnt >= MAX_SHOW_NUM:
            break
        wallList.append(wall)
        cnt+=1
    return wallList
    
def getMyWalls(userId):
    query = walls.select().where(walls.ownerId == userId).order_by(walls.id.desc()).limit(MAX_SHOW_NUM)
    wallList = []
    cnt = 0
    for wall in query:
        if cnt >= MAX_SHOW_NUM:
            break
        wallList.append(wall)
        cnt+=1
    return wallList
    
def searchWalls(key):
    ideaList = IDEA.searchIdeas(key)
    key = key.join(('%', '%')) # made 'key' --> '%key%'
    wallQuery = walls.select().where( (walls.title**key) | (walls.description**key)   ).order_by(walls.id.desc())
    wallQuery = wallQuery.where(walls.privacy == 'public')
    wallList = []
    cnt = 0
    for wall in wallQuery:
        if cnt >= MAX_SHOW_NUM:
            break
        wallList.append(wall)
        cnt+=1
    # search by idea to wall
    
    for idea in ideaList:
        wallIdList = IDEA_IN_WALL.getWallIdListByIdeaId(idea.id)
        for wid in wallIdList:
            wall = getWallById(wid)
            if wall not in wallList:
                wallList.append(wall)
    return wallList



def create(title, description, ownerId, privacy):
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