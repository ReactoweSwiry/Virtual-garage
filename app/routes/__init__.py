from flask import Flask

from .car import car_routes
from .action import action_routes


def routes(app: Flask):
    car_routes(app)
    action_routes(app)
