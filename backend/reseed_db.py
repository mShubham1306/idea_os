"""
Force reseed the database with the expanded dataset
"""
import csv
import os
from datetime import datetime, timedelta
import random

try:
    from backend.app import create_app
    from backend.Database.db import db
    from backend.models.idea_model import Idea
    from backend.models.report_model import Report
except ImportError:
    from app import create_app  # type: ignore
    from Database.db import db  # type: ignore
    from models.idea_model import Idea  # type: ignore
    from models.report_model import Report  # type: ignore


CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'startup_ideas.csv')


def reseed():
    app = create_app()
    with app.app_context():
        # Drop all tables and recreate
        db.drop_all()
        db.create_all()
        print("Database reset successfully")

        # Read and seed data
        with open(CSV_PATH, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        now = datetime.utcnow()
        for i, row in enumerate(rows):
            created = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
            idea = Idea(
                title=row['title'],
                description=row['description'],
                category=row['category'],
                created_at=created,
            )
            db.session.add(idea)
            db.session.flush()

            score = float(row.get('score', 7.0))
            report = Report(
                idea_id=idea.id,
                score=score,
                sentiment=row.get('sentiment', 'neutral'),
                keywords=row.get('keywords', ''),
                execution_plan=f"Detailed execution plan for: {row['title']}",
                created_at=created,
            )
            db.session.add(report)

        db.session.commit()
        print(f'Successfully seeded {len(rows)} ideas with reports!')


if __name__ == '__main__':
    reseed()
