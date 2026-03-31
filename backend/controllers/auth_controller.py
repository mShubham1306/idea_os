from backend.Database.db import db
from backend.models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import jwt
from flask import current_app


def signup(email, password):
    if not email or not password:
        return {'error': 'email and password required'}, 400
    existing = User.query.filter_by(email=email).first()
    if existing:
        return {'error': 'email already registered'}, 409

    pw_hash = generate_password_hash(password)
    user = User(email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return {'message': 'user created', 'user': user.to_dict()}, 201


def login(email, password):
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {'error': 'invalid credentials'}, 401

    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }
    token = jwt.encode(payload, current_app.config.get('SECRET_KEY'), algorithm='HS256')
    return {'token': token}
    
