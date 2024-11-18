from flask import Flask

from .car import car_routes
from .car_action import car_action_routes


def routes(app: Flask):
    car_routes(app)
    car_action_routes(app)
