import time
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import NoResultFound
from sqlalchemy import desc, func

from ..database import Session
from ..models import Car, Action
from ..utils import process_image, convert_blob_to_base64

car_routes = Blueprint('car', __name__)


@car_routes.route('/cars', methods=['GET'])
def get_cars():
    session = Session()
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 3))

        offset = (page - 1) * page_size

        start_time = time.time()
        cars_query = session.query(Car).order_by(
            desc(Car.id)).limit(page_size).offset(offset)
        end_time = time.time()
        print(f"Query took {start_time} - {end_time}")

        cars = cars_query.all()

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

        total_count = session.query(func.count(Car.id)).scalar()
        total_pages = (total_count + page_size - 1) // page_size

        return jsonify({
            'cars': result,
            'page': page,
            'total_count': total_count,
            'total_pages': total_pages
        })
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@car_routes.route('/cars', methods=['POST'])
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


@car_routes.route('/car/<int:car_id>', methods=['PATCH'])
def upload_car_image(car_id):
    car_image = request.files['file']

    car_image_processed = process_image(car_image)

    session = Session()

    try:
        car = session.query(Car).filter_by(id=car_id).one()
        car.car_image = car_image_processed
        session.commit()
        return jsonify({'message': 'Car image updated successfully'})
    except NoResultFound:
        session.rollback()
        return jsonify({'error': f'Car with ID {car_id} not found'}), 404
    finally:
        session.close()


@car_routes.route('/car/<int:car_id>', methods=['GET'])
def get_car(car_id):
    session = Session()

    try:
        car = session.query(Car).filter_by(id=car_id).one()
        actions = session.query(Action).filter_by(car_id=car_id).all()
        car_image = convert_blob_to_base64(
            car.car_image) if car.car_image else None

        return jsonify({
            'car': {'id': car.id, 'name': car.name, 'model': car.model,
                    'plate_number': car.plate_number, 'year': car.year, 'car_image': car_image},
            'actions': [
                {'id': action.id, 'action': action.action,
                    'details': action.details, 'date': action.date, 'type': action.type, 'cost': action.cost}
                for action in actions]
        })
    except NoResultFound:
        session.rollback()
        return jsonify({'error': f'Car with ID {car_id} not found'}), 404
    finally:
        session.close()
