import database as db
import peewee as pw
import userLogTag as USER_LOG_TAG
import random
import os
import time

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
            imgPath = IMG_DIR + "idea_" + str(idea.id) + ".txt"
            os.remove(imgPath)
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
    try:    
        f = open(idea.img, 'r')
        msg['img'] = f.read()
    finally:
        return msg
    
def getLatestIdeas():
    ideaQuery = ideas.select().where(ideas.privacy=="public").order_by(ideas.id.desc()).limit(NUM_OF_BLOCKS)
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt >= NUM_OF_BLOCKS:
            break
        ideaList.append(idea)
        cnt+=1
    return ideaList

def getMyIdeas(userId):
    ideaQuery = ideas.select().where(ideas.ownerId == userId ).order_by(ideas.id.desc()).limit(NUM_OF_BLOCKS)
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt >= NUM_OF_BLOCKS:
            break
        ideaList.append(idea)
        cnt+=1
    return ideaList

def getRecommendIdeas(userId):
    tagList = USER_LOG_TAG.getTagList(userId)
    ideaList = []
    for tag in tagList:
        tmpList = searchIdeas(tag.tag)
        for tmpIdea in tmpList:
            if tmpIdea not in ideaList:
                ideaList.append(tmpIdea)
    if len(ideaList) < NUM_OF_BLOCKS:
        tmpList = getHottestIdeas()
        listLen = len(ideaList)
        cnt = 0
        for tmpIdea in tmpList:
            if cnt + listLen > NUM_OF_BLOCKS:
                break
            if tmpIdea not in ideaList:
                ideaList.append(tmpIdea)
                cnt += 1
    random.shuffle(ideaList)            
    return ideaList
    
def getRandMyIdeas(userId):
    ideaQuery = ideas.select().where(ideas.ownerId == userId ).order_by( ideas.id.desc() )
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt > NUM_OF_BLOCKS:
            if random.randint(0, 5) > 0:
                continue
        ideaList.append(idea)
        cnt+=1
    random.shuffle(ideaList)
    while cnt > NUM_OF_BLOCKS:
        ideaList.pop()
        cnt -= 1
    return ideaList

def getRandIdeas(userId=None):
    ideaQuery = ideas.select().order_by(ideas.id.desc())
    if userId is None:
        ideaQuery = ideaQuery.where(ideas.privacy=="public")
    else:
        ideaQuery = ideaQuery.where(ideas.ownerId==userId)
    ideaList = []
    cnt = 0
    for idea in ideaQuery:
        if cnt > NUM_OF_BLOCKS:
            if random.randint(0, 5) > 0:
                continue
        ideaList.append(idea)
        cnt += 1
    random.shuffle(ideaList)
    while cnt > NUM_OF_BLOCKS:
        ideaList.pop()
        cnt -= 1
    return ideaList
    
def getHottestIdeas(userId=None):
    ideaQuery = ideas.select().order_by(ideas.linkNum.desc()).order_by(ideas.id.desc())
    if userId is None:
        ideaQuery = ideaQuery.where(ideas.privacy=="public")
    else:
        ideaQuery = ideaQuery.where(ideas.ownerId == userId)
    ideaQuery.limit(NUM_OF_BLOCKS)
    ideaList = []
    for idea in ideaQuery:
        ideaList.append(idea)
    random.shuffle(ideaList)
    return ideaList
    
def searchIdeas(key, userId=None):
    key = key.join(('%', '%')) # made 'key' --> '%key%'
    ideaQuery = ideas.select().where( (ideas.title**key) | (ideas.description**key) | (ideas.owner**key)  ).order_by(ideas.id.desc())
    if userId is None:
        ideaQuery = ideaQuery.where(ideas.privacy == 'public')
    else:
        ideaQuery = ideaQuery.where(ideas.ownerId == userId )
        
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