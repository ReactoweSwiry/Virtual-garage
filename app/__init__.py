from flask import Flask
from flask_cors import CORS

from .database import engine
from .routes import routes

from .models import Base


def create_app():
    app = Flask(__name__)
    CORS(app)
    routes(app)

    Base.metadata.create_all(engine)

    return app
