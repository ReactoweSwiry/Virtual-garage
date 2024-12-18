from flask import Flask, jsonify, request
from sqlalchemy.orm.exc import NoResultFound

from ..database import Session
from ..utils import convert_blob_to_base64
from ..models import Car, Car_Action


def car_routes(app: Flask):

    @app.route('/cars', methods=['GET'])
    def get_cars():
        session = Session()
        try:
            cars = session.query(Car).all()
            result = []

            for car in cars:
                car_image = None

                if isinstance(car.car_image, (bytes, bytearray)):
                    car_image = convert_blob_to_base64(car.car_image)

                result.append({
                    'id': car.id,
                    'name': car.name,
                    'model': car.model,
                    'plate_number': car.plate_number,
                    'year': car.year,
                    'car_image': car_image
                })
            return jsonify(result)
        finally:
            session.close()

    @app.route('/car/add', methods=['POST'])
    def add_car():
        data = request.get_json()
        name = data.get('name')
        model = data.get('model')
        plate_number = data.get('plate_number')
        year = data.get('year')

        session = Session()

        try:
            new_car = Car(name=name, model=model, year=year,
                          plate_number=plate_number)
            session.add(new_car)
            session.commit()
            return jsonify({'message': 'Car added successfully'})
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()

    @app.route('/car/upload-image/<int:car_id>', methods=['PATCH'])
    def upload_car_image(car_id):
        car_image = request.files['file']
        car_image_blob = car_image.read()

        session = Session()

        try:
            car = session.query(Car).filter_by(id=car_id).one()
            car.car_image = car_image_blob
            session.commit()
            return jsonify({'message': 'Car image updated successfully'})
        except NoResultFound:
            return jsonify({'error': f'Car with ID {car_id} not found'}), 404
        finally:
            session.close()

    @app.route('/car/<int:car_id>', methods=['GET'])
    def get_car_actions(car_id):
        session = Session()

        try:
            car = session.query(Car).filter_by(id=car_id).one()
            actions = session.query(Car_Action).filter_by(car_id=car_id).all()

            car_image = convert_blob_to_base64(
                car.car_image)

            return jsonify({
                'car': {'id': car.id, 'name': car.name, 'model': car.model,
                        'plate_number': car.plate_number, 'year': car.year, 'car_image': car_image},
                'actions': [
                    {'id': action.id, 'action': action.action,
                        'details': action.details, 'date': action.date}
                    for action in actions]
            })
        except NoResultFound:
            return jsonify({'error': f'Car with ID {car_id} not found'}), 404
        finally:
            session.close()
