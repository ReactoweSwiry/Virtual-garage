from flask import Flask, jsonify, request
from app.database import engine, Session
from app.models import Base, Car

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
        return jsonify([
            {'id': car.id, 'name': car.name, 'model': car.model,
                'plate_number': car.plate_number, 'year': car.year}
            for car in cars])
    finally:
        session.close()


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
