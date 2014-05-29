import database as db
import peewee as pw
import random
import ideaInWall as IDEA_IN_WALL
import userLogTag as USER_LOG_TAG
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
    
def getRecomendWall(userId = None):
    wallList = []
    if userId is None:
        wallList = getRandWall()
        return wallList
      
    tagList = USER_LOG_TAG.getTagList(userId)
    for tag in tagList:
        tmpList = searchWalls(tag.tag)
        for tmpWall in tmpList:
            if tmpWall not in wallList:
                wallList.append(tmpWall)
    if len(wallList) < MAX_SHOW_NUM:
        tmpList = getRandWall()
        listLen = len(wallList)
        cnt = 0
        for tmpWall in tmpList:
            if listLen + cnt > MAX_SHOW_NUM:
                break
            if tmpWall not in wallList:
                wallList.append(tmpWall)
                cnt += 1    
    #random.shuffle(wallList)            
    return wallList
    
def getRandWall():
    wallQuery = walls.select().order_by( walls.id.desc() )
    wallList = []
    cnt = 0
    for w in wallQuery:
        if cnt > MAX_SHOW_NUM:
            if random.randint(0, 5) > 0:
                continue
        wallList.append(w)
        cnt+=1
    random.shuffle(wallList)
    while cnt > MAX_SHOW_NUM:
        wallList.pop()
        cnt -= 1
    
    return wallList
    
def searchWalls(searchKey, userId=None):
    key = searchKey.join(('%', '%')) # made 'key' --> '%key%'
    wallQuery = walls.select().where( (walls.title**key) | (walls.description**key)   ).order_by(walls.id.desc())
    if userId is None:
        wallQuery = wallQuery.where(walls.privacy == 'public')
    else:
        wallQuery = wallQuery.where(walls.ownerId == userId)
    wallQuery.limit(MAX_SHOW_NUM)
    wallList = []

    for wall in wallQuery:
        wallList.append(wall)
        
    # search by idea to wall
    ideaList = IDEA.searchIdeas(searchKey)
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