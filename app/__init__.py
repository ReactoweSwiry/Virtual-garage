from flask import Flask
from flask_cors import CORS

from .database import engine
from .routes import routes

from .models import Base


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    routes(app)

    Base.metadata.create_all(engine)

    return app
