"""
Seed the database with startup idea data from CSV.
Run from project root:  python -m backend.seed_db
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
    from app import create_app
    from Database.db import db
    from models.idea_model import Idea
    from models.report_model import Report


CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'startup_ideas.csv')


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        # avoid duplicate seeding
        if Idea.query.count() > 0:
            print(f'Database already has {Idea.query.count()} ideas — skipping seed.')
            return

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
        print(f'Seeded {len(rows)} ideas with reports.')


if __name__ == '__main__':
    seed()
