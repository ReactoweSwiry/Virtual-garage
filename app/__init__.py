from flask import Flask

from .database import engine
from .routes import routes

from .models import Base


def create_app():
    app = Flask(__name__)
    routes(app)

    Base.metadata.create_all(engine)

    return app
