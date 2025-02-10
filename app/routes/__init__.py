from flask import Flask

from .car import car_routes
from .action import action_routes


def routes(app: Flask):
    app.register_blueprint(car_routes)
    app.register_blueprint(action_routes)
