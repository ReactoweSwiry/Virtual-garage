from flask import Flask
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase

from .database import engine
from .routes import routes


class Base(DeclarativeBase):
    pass


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    routes(app)

    Base.metadata.create_all(engine)

    return app
