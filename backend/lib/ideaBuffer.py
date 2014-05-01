import database as db
import peewee as pw
import idea as IDEA

class ideabuffer(db.MySQLModel):
    id = pw.PrimaryKeyField()
    ideaId = pw.IntegerField()
    userId = pw.CharField()

def add(ideaId, userId):
    try:
        tmp = ideabuffer.get(ideabuffer.userId == userId, ideabuffer.ideaId == ideaId)
    except ideabuffer.DoesNotExist:
        idea = ideabuffer.create(userId=userId, ideaId=ideaId)
        idea.save() 

def getAllBuff(userId):
    buffQuery = ideabuffer.select().where(ideabuffer.userId == userId ).order_by(ideabuffer.id.desc())
    buffList = []
    cnt = 0
    for i in buffQuery:
        idea = IDEA.getIdeaById(i.ideaId)
        buffList.append(idea)
    return buffList
