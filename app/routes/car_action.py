from flask import Flask, jsonify, request
from sqlalchemy.orm.exc import NoResultFound
from datetime import datetime

from ..database import Session

from ..models import Car, Car_Action
from ..utils import read_data_from_img


def car_action_routes(app: Flask):

    @app.route('/action/autocomplete_from_image', methods=['POST'])
    def autocomplete_from_image():
        car_action_image = request.files['file']
        output = read_data_from_img(car_action_image)

        return output

    @app.route('/action/add/<int:car_id>', methods=['POST'])
    def add_action(car_id):
        data = request.get_json()
        action = data.get('action')
        details = data.get('details')
        service_station_name = data.get('service_station_name')
        date = data.get('date')

        # Add image from form/state (?)

        session = Session()

        try:
            car = session.query(Car).filter_by(id=car_id).one()

            car_action = Car_Action(
                car_id=car.id,
                action=action,
                details=details,
                service_station_name=service_station_name,
                date=datetime.strptime(
                    date, '%Y-%m-%d %H:%M:%S') if date else datetime.utcnow()
            )

            session.add(car_action)
            session.commit()

            return jsonify({'message': 'Action added successfully!', 'car_id': car_id})
        except NoResultFound:
            return jsonify({'error': f'Car with ID {car_id} not found'}), 404
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()
