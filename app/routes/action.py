from flask import Flask, jsonify, request
from sqlalchemy.orm.exc import NoResultFound
from datetime import datetime

from ..database import Session

from ..models import Car, Action


def action_routes(app: Flask):
    @app.route('/action/<int:action_id>', methods=['GET'])
    def get_action(action_id):
        session = Session()

        try:
            action = session.query(Action).filter_by(id=action_id).one()
            return jsonify(action.to_dict())
        except NoResultFound:
            return jsonify({'error': f'Action with ID {action_id} not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()

    @app.route('/action/<int:car_id>', methods=['POST'])
    def add_action(car_id):
        data = request.get_json()
        action = data.get('action')
        details = data.get('details')
        service_station_name = data.get('service_station_name')
        date = data.get('date')
        type = data.get('type')
        cost = data.get('cost')

        session = Session()

        try:
            car = session.query(Car).filter_by(id=car_id).one()

            car_action = Action(
                car_id=car.id,
                action=action,
                details=details,
                service_station_name=service_station_name,
                type=type,
                cost=cost,
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

    @app.route('/action/<int:action_id>', methods=['PUT'])
    def edit_action(action_id):
        data = request.get_json()
        session = Session()

        try:
            car_action = session.query(Action).filter_by(id=action_id).one()

            # Update fields if provided
            car_action.action = data.get('action', car_action.action)
            car_action.details = data.get('details', car_action.details)
            car_action.service_station_name = data.get(
                'service_station_name', car_action.service_station_name)
            car_action.type = data.get('type', car_action.type)
            car_action.cost = data.get('cost', car_action.cost)
            car_action.date = datetime.strptime(
                data['date'], '%Y-%m-%d %H:%M:%S') if 'date' in data else car_action.date

            session.commit()

            return jsonify({'message': 'Action updated successfully!', 'action_id': action_id})
        except NoResultFound:
            return jsonify({'error': f'Action with ID {action_id} not found'}), 404
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()

    @app.route('/action/<int:action_id>', methods=['DELETE'])
    def delete_action(action_id):
        session = Session()
        try:
            car_action = session.query(Action).filter_by(id=action_id).one()
            session.delete(car_action)
            session.commit()

            return jsonify({'message': 'Action deleted successfully!', 'action_id': action_id})
        except NoResultFound:
            return jsonify({'error': f'Action with ID {action_id} not found'}), 404
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()
