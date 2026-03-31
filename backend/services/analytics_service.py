from collections import Counter
from backend.models.idea_model import Idea
from backend.models.report_model import Report
from backend.Database.db import db
from functools import lru_cache

# improved analytics using SQL aggregates to avoid loading all rows into memory
# cache results in memory to avoid hitting database on every request; invalidation
# requires app restart or manual cache_clear when new data is added.
@lru_cache(maxsize=1)
def generate_dashboard_stats():
    total_ideas = Idea.query.count()

    avg_score = db.session.query(db.func.avg(Report.score)).scalar() or 0
    avg_score = round(avg_score, 2)

    # most common category (tuple list)
    top_cat = (
        db.session.query(Idea.category, db.func.count(Idea.id).label('cnt'))
        .filter(Idea.category.isnot(None))
        .group_by(Idea.category)
        .order_by(db.desc('cnt'))
        .limit(1)
        .all()
    )
    top_category = list(top_cat[0]) if top_cat else None

    # keywords are stored as comma-separated text; pull and aggregate
    keyword_list = []
    for kw_row in db.session.query(Report.keywords).filter(Report.keywords.isnot(None)):
        keyword_list.extend([k.strip() for k in kw_row[0].split(',') if k.strip()])

    top_keywords = Counter(keyword_list).most_common(5)

    # simple history: average score per day (last 7 days)
    history = []
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    for i in range(7):
        day = today - timedelta(days=i)
        avg = (
            db.session.query(db.func.avg(Report.score))
            .filter(db.func.date(Report.created_at) == day)
            .scalar()
            or 0
        )
        history.append({'date': day.isoformat(), 'avg_score': round(avg, 2)})
    history.reverse()

    # category distribution
    cat_dist = [
        {'category': cat, 'count': cnt}
        for cat, cnt in
        db.session.query(Idea.category, db.func.count(Idea.id))
          .filter(Idea.category.isnot(None))
          .group_by(Idea.category)
          .all()
    ]

    return {
        'total_ideas': total_ideas,
        'average_score': avg_score,
        'top_category': top_category,
        'top_keywords': top_keywords,
        'history': history,
        'category_distribution': cat_dist,
    }
