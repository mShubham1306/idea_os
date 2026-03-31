from backend.Database.db import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    # foreign key constraint and index for faster joins
    idea_id = db.Column(db.Integer, db.ForeignKey('ideas.id', ondelete='CASCADE'), nullable=False, index=True)
    score = db.Column(db.Float, nullable=True, index=True)
    # breakdown or explanation (stored as JSON string or text)
    score_breakdown = db.Column(db.Text, nullable=True)
    sentiment = db.Column(db.String(20), nullable=True, index=True)
    execution_plan = db.Column(db.Text, nullable=True)
    funding_options = db.Column(db.Text, nullable=True)
    licenses_required = db.Column(db.Text, nullable=True)
    keywords = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'idea_id': self.idea_id,
            'score': self.score,
            'score_breakdown': self.score_breakdown,
            'sentiment': self.sentiment,
            'execution_plan': self.execution_plan,
            'funding_options': self.funding_options,
            'licenses_required': self.licenses_required,
            'keywords': self.keywords,
            'created_at': self.created_at.isoformat()
        }
