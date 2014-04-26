import database as db
import peewee as pw

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