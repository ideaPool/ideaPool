import peewee as pw
import pymysql

DB_LOCATE = "localhost"
DB_USER = "root"
DB_PASSWD = "ideaPool"
DB_CHOSEN = "ideaPool"


# connect
myDb = pw.MySQLDatabase(DB_CHOSEN, host=DB_LOCATE,  user= DB_USER , passwd= DB_PASSWD)
myDb.connect()


class MySQLModel(pw.Model):
    class Meta:
        database = myDb
        