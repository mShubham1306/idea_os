from backend.utils.keyword_extractor import extract_keywords
from backend.utils.dsa_ranker import rank_keywords
from backend.services.gemini_service import GeminiService
from backend.services.scoring_service import score_idea
from backend.services.language_service import LanguageService
from backend.Database.db import db
from backend.models.idea_model import Idea
from backend.models.report_model import Report

ai_svc = GeminiService()
language = LanguageService()


def _find_related_ideas(keywords, limit=3):
    if not keywords:
        return []
    matches = []
    kwset = set(k.lower() for k in keywords)
    for idea in Idea.query.order_by(Idea.created_at.desc()).limit(50).all():
        if idea.description:
            desc_words = set(idea.description.lower().split())
            if kwset & desc_words:
                matches.append(idea.to_dict())
        if len(matches) >= limit:
            break
    return matches


def analyze_idea(idea_text=None, category=None, audio_bytes=None, audio_filename=None):
    # optionally transcribe audio input
    if not idea_text and audio_bytes:
        idea_text = language.transcribe_audio(audio_bytes, filename=audio_filename)

    if not idea_text:
        return {'error': 'No idea provided'}

    # extract keywords and ranking
    keywords = extract_keywords(idea_text)
    ranked = rank_keywords(keywords)

    # AI expansion & structured analysis
    expanded = ai_svc.generate_expansion(idea_text)
    detailed = ai_svc.generate_detailed_analysis(idea_text)

    score_data = score_idea(idea_text, keywords, category=category)
    score = score_data['score']
    sentiment = language.analyze_sentiment(idea_text)
    related = _find_related_ideas(keywords)

    # Generate executive summary
    summary = ai_svc.generate_summary(
        idea_text, score,
        score_data.get('idea_quality', 'Basic'),
        score_data.get('detected_sector', category or 'General'),
        detailed,
    )

    # Persist idea and report
    try:
        idea = Idea(description=idea_text, category=category, title=idea_text[:100])
        db.session.add(idea)
        db.session.flush()

        report = Report(
            idea_id=idea.id,
            score=score,
            score_breakdown=str(score_data.get('detail', [])),
            sentiment=sentiment,
            execution_plan=expanded,
            keywords=','.join(keywords),
        )
        db.session.add(report)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return {'error': 'database error', 'details': str(exc)}

    # Invalidate cached analytics
    try:
        from backend.services.analytics_service import generate_dashboard_stats
        generate_dashboard_stats.cache_clear()
    except Exception:
        pass

    # Get sector context
    sector_detail = {}
    try:
        from backend.services.market_intelligence_service import get_sector_detail
        sector_detail = get_sector_detail(category, idea_text)
    except Exception:
        pass

    return {
        'idea': idea.to_dict(),
        'report': report.to_dict(),
        'ranked_keywords': ranked,
        'sentiment': sentiment,
        'related_ideas': related,
        'score': score,
        'detailed_analysis': detailed,
        'score_breakdown': score_data.get('detail', []),
        'score_components': score_data.get('breakdown', {}),
        'scoring_explanations': score_data.get('explanations', {}),
        'dimension_info': score_data.get('dimension_info', {}),
        'idea_quality': score_data.get('idea_quality', 'Basic'),
        'improvement_tips': score_data.get('improvement_tips', []),
        'summary': summary,
        'detected_sector': score_data.get('detected_sector', category or 'General'),
        'related_sectors': score_data.get('related_sectors', []),
        'sector_intel': sector_detail,
        'execution_plan': expanded,
    }


def get_history():
    results = []
    for report in Report.query.order_by(Report.created_at.desc()).all():
        idea = Idea.query.get(report.idea_id)
        if idea:
            results.append({
                'id': report.id,
                'idea': idea.description,
                'title': idea.title or idea.description[:60],
                'category': idea.category or 'General',
                'score': report.score,
                'sentiment': report.sentiment,
                'date': report.created_at.strftime('%Y-%m-%d'),
            })
    return results
