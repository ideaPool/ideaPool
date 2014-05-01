import database as db
import peewee as pw
import urllib2
import json

loginUserAuth = {}

class users(db.MySQLModel):
    id = pw.PrimaryKeyField()
    email = pw.CharField()

def checkAndSaveUser(id, email):
    try:
        user = users.get(users.id == id)
    except users.DoesNotExist:
        user = users.create(id=id, email=email)
    finally:
        user.save()

def userLogin(msg):
    user = getFbUserInfo(msg['accessToken'])
    checkAndSaveUser(user['id'], user['email'])
        

def userLogout(userId):
    loginUserAuth.pop( msg['id'], None )
    
    
def getFbUserInfo(accessToken):
    url = "https://graph.facebook.com/me?access_token="+ str(accessToken)
    content = urllib2.urlopen(url).read()
    user = json.loads(content)
    return user
    

