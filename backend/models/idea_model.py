from backend.Database.db import db
from datetime import datetime

class Idea(db.Model):
    __tablename__ = 'ideas'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    title = db.Column(db.String(256), nullable=True)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    # relationship to reports (lazy dynamic for large datasets)
    reports = db.relationship('Report', backref='idea', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'created_at': self.created_at.isoformat()
        }
