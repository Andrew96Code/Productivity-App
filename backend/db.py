import psycopg2
import psycopg2.extras
from flask import g

def get_db():
    if 'db' not in g:
        # Replace these with your actual database credentials
        g.db = psycopg2.connect(
            dbname='productivity_app',
            user='postgres',
            password='your_password',
            host='localhost',
            port='5432'
        )
        # Return results as dictionaries
        g.db.cursor_factory = psycopg2.extras.DictCursor
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close() 