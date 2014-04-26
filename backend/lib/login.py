import database as db
import peewee as pw

class users(db.MySQLModel):
    id = pw.PrimaryKeyField()
    email = pw.CharField()

def checkAndSaveUser(msg):
    id = msg['id']
    email = msg['email']
    try:
        user = users.get(users.id == id)
    except users.DoesNotExist:
        user = users.create(id=id, email=email)
    finally:
        user.save()