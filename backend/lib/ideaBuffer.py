import database as db
import peewee as pw
import idea as IDEA

class ideaBuffer(db.MySQLModel):
    id = pw.PrimaryKeyField()
    ideaId = pw.IntegerField()
    userId = pw.CharField()
    # in peewee, deal with uppercased table name (in default it would change to lowwer case)
    class Meta:
        db_table = 'ideaBuffer'

def add(ideaId, userId):
    try:
        tmp = ideaBuffer.get(ideaBuffer.userId == userId, ideaBuffer.ideaId == ideaId)
    except ideaBuffer.DoesNotExist:
        ideaBuff = ideaBuffer.create(userId=userId, ideaId=ideaId)
        idea = IDEA.getIdeaById(ideaId)
        if idea is not None:
            idea.linkNum += 1
            idea.save()
            ideaBuff.save()
        else:
            print "the idea to buff doesn't exist!"
        
def delete(ideaId, userId):
    try:
        ideaBuff = ideaBuffer.get( (ideaBuffer.ideaId==ideaId) & (ideaBuffer.userId==userId) )
        idea = IDEA.getIdeaById(ideaId)
        if idea is not None:
            idea.linkNum -= 1
            if idea.linkNum > 0:
                idea.save()
            else:
                idea.delete_instance()
        ideaBuff.delete_instance()
        return ideaBuff
    except ideaBuffer.DoesNotExist:
        print "idea not exist in buff!! ideaId: ", ideaId, "userId: ", userId
        return None
        
def getAllBuff(userId):
    buffQuery = ideaBuffer.select().where(ideaBuffer.userId == userId ).order_by(ideaBuffer.id.desc())
    buffList = []
    cnt = 0
    for i in buffQuery:
        idea = IDEA.getIdeaById(i.ideaId)
        if idea is not None:
            buffList.append(idea)
        else:
            i.delete_instance()
    return buffList
