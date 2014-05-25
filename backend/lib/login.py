import database as db
import peewee as pw
import urllib2
import json

loginUserAuth = {}

class users(db.MySQLModel):
    id = pw.PrimaryKeyField()
    email = pw.CharField()
    name = pw.CharField()

def checkAndSaveUser(id, email, name):
    try:
        user = users.get(users.id == id)
    except users.DoesNotExist:
        user = users.create(id=id, email=email, name = name)
    finally:
        user.save()

def userLogin(msg):
    try:
        user = getFbUserInfo(msg['accessToken'])
        checkAndSaveUser(user['id'], user['email'], user['name'])
        return user
    except:
        return None

def userLogout(userId):
    loginUserAuth.pop( msg['id'], None )
    
    
def getFbUserInfo(accessToken):
    url = "https://graph.facebook.com/me?access_token="+ str(accessToken)
    content = urllib2.urlopen(url).read()
    user = json.loads(content)
    return user
    

