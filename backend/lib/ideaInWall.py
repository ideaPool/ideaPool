import database as db
import peewee as pw
import idea as IDEA

class ideaInWall(db.MySQLModel):
    id = pw.PrimaryKeyField()
    ideaId = pw.IntegerField()
    wallId = pw.IntegerField() 
    # in peewee, deal with uppercased table name (in default it would change to lowwer case)
    class Meta:
        db_table = 'ideaInWall'

def add(ideaId, wallId):
    try:
        tmp = ideaInWall.get(ideaInWall.wallId == wallId, ideaInWall.ideaId == ideaId)
    except ideaInWall.DoesNotExist:
        ideaW = ideaInWall.create(wallId=wallId, ideaId=ideaId)
        idea = IDEA.getIdeaById(ideaId)
        if idea is not None:
            idea.linkNum += 1
            idea.save()
            ideaW.save()
        else:
            print("saving unexisting idea error!!")
        
def delete(ideaId, wallId):
    try:
        tmp = ideaInWall.get( (ideaInWall.ideaId==ideaId) & (ideaInWall.wallId==wallId) )
        idea = IDEA.getIdeaById(ideaId)
        if idea is not None:
            idea.linkNum -= 1
            if idea.linkNum>0:
                idea.save()
            else:
                idea.delete_instance()
        tmp.delete_instance()
        return tmp
    except ideaInWall.DoesNotExist:
        print "idea not exist in ideaInWall!! ideaId: ", ideaId, "wallId: ", wallId
        return None
        
def getAllWallIdea(wallId):
    listQuery = ideaInWall.select().where(ideaInWall.wallId == wallId ).order_by(ideaInWall.id.desc())
    ideaList = []
    cnt = 0
    for i in listQuery:
        idea = IDEA.getIdeaById(i.ideaId)
        if idea is not None:
            ideaList.append(idea)
        else:
            i.delete_instance()
    return ideaList
    
def delWall(wallId):
    try:
        ideaW = ideaInWall.get(ideaInWall.wallId == wallId)
        ideaW.delete_insatnce()
    except ideaInWall.DoesNotExist:
        pass