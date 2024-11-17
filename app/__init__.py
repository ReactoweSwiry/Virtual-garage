from flask import Flask, jsonify, request
from app.database import engine, Session
from app.models import Base, Car, CarAction
from sqlalchemy.orm.exc import NoResultFound
from datetime import datetime

app = Flask(__name__)

Base.metadata.create_all(engine)


@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Car API!'})


@app.route('/add_car', methods=['POST'])
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


@app.route('/cars', methods=['GET'])
def get_cars():
    session = Session()
    try:
        cars = session.query(Car).all()
        result = []
        for car in cars:
            result.append({
                'id': car.id,
                'name': car.name,
                'model': car.model,
                'plate_number': car.plate_number,
                'year': car.year,
                'actions': [
                    {
                        'id': action.id,
                        'action': action.action,
                        'details': action.details,
                        'date': action.date.strftime('%Y-%m-%d %H:%M:%S')
                    }
                    for action in car.actions
                ]
            })
        return jsonify(result)
    finally:
        session.close()

@app.route('/add_action/<int:car_id>', methods=['POST'])
def add_action(car_id):
    data = request.get_json()
    action = data.get('action')
    details = data.get('details')
    date = data.get('date') # Optional

    session = Session()

    try:
        car = session.query(Car).filter_by(id=car_id).one()

        car_action = CarAction(
            car_id=car.id,
            action=action,
            details=details,
            date=datetime.strptime(date, '%Y-%m-%d %H:%M:%S') if date else datetime.utcnow()
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


@app.route('/car/<int:car_id>', methods=['GET'])
def get_car_actions(car_id):
    session = Session()

    try:
        car = session.query(Car).filter_by(id=car_id).one()
        actions = session.query(CarAction).filter_by(car_id=car_id).all()

        return jsonify({
            'car': {'id': car.id, 'name': car.name, 'model': car.model,
                    'plate_number': car.plate_number, 'year': car.year},
            'actions': [
                {'id': action.id, 'action': action.action, 'details': action.details, 'date': action.date}
                for action in actions]
        })
    except NoResultFound:
        return jsonify({'error': f'Car with ID {car_id} not found'}), 404
    finally:
        session.close()



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
