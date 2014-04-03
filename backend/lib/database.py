import peewee as pw
import pymysql

DB_LOCATE = "localhost"
DB_USER = "root"
DB_PASSWD = "ideaPool"
DB_CHOSEN = "ideaPool"

# connect
def getDbConnection():
    db = pw.MySQLDatabase(DB_CHOSEN,  user= DB_USER , passwd= DB_PASSWD)
    db.connect
    return db

class MySQLModel(pw.Model):
    class Meta:
        database = db