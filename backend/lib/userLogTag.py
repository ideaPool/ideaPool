import database as db
import peewee as pw
import idea as IDEA

class userLogTag(db.MySQLModel):
    id = pw.PrimaryKeyField()
    userId = pw.CharField()
    tag = pw.CharField()
    cnt = pw.IntegerField()
    # in peewee, deal with uppercased table name (in default it would change to lowwer case)
    class Meta:
        db_table = 'userLogTag'
        
        
def add(userId, tag):
    try:
        newTag = userLogTag.get(userLogTag.userId == userId , userLogTag.tag == tag)
        newTag.cnt += 1
    except userLogTag.DoesNotExist:
        newTag = userLogTag.create(userId=userId, tag=tag, cnt=1)
    finally:
        newTag.save()
        return newTag
        
def getTagList(userId):
    tagList = []
    tagQuery = userLogTag.select().where( userLogTag.userId == userId ).order_by(userLogTag.cnt.desc())
    for tag in tagQuery:
        tagList.append(tag)
    return tagList
        