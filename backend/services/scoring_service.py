"""
Scoring Service — Data-Driven Idea Evaluation
Scores ideas 0–10 using keyword analysis, description quality,
market alignment from real stock data, and sector intelligence.
Works for ANY sector globally through auto-detection.
Now includes detailed explanations and vague-idea support.
"""


# ── Idea quality classification ──────────────────────────────
DIMENSION_INFO = {
    'keyword_diversity': {
        'icon': '🔑',
        'title': 'Keyword Diversity',
        'what': 'How many unique, meaningful keywords appear in your idea description.',
        'why': 'More diverse keywords indicate a well-thought-out concept covering multiple aspects.',
    },
    'description_quality': {
        'icon': '📝',
        'title': 'Description Quality',
        'what': 'The depth and structure of your idea description — word count, sentence structure, and clarity.',
        'why': 'Well-articulated ideas with proper sentences signal clearer thinking and better planning.',
    },
    'market_signals': {
        'icon': '📊',
        'title': 'Market Signals',
        'what': 'Presence of business/market terminology like revenue model, target audience, TAM, unit economics.',
        'why': 'Ideas mentioning market fundamentals show awareness of business viability.',
    },
    'innovation': {
        'icon': '💡',
        'title': 'Innovation Score',
        'what': 'Use of cutting-edge technology keywords — AI, blockchain, IoT, automation, etc.',
        'why': 'Innovative technologies can differentiate your idea and create competitive moats.',
    },
    'feasibility': {
        'icon': '⚙️',
        'title': 'Feasibility',
        'what': 'Mentions of execution-related concepts — MVP, prototype, roadmap, team, partnerships.',
        'why': 'Ideas with clear execution thinking are more likely to succeed beyond the concept stage.',
    },
    'market_alignment': {
        'icon': '🎯',
        'title': 'Market Alignment',
        'what': 'How well your idea aligns with the real performance of its detected sector.',
        'why': 'Ideas in growing, healthy market sectors have higher chances of success.',
    },
    'market_trend': {
        'icon': '📈',
        'title': 'Market Trend Bonus',
        'what': 'Bonus score based on real stock market trends in the detected sector.',
        'why': 'Sectors with positive momentum offer better timing for new entrants.',
    },
}


def _classify_idea_quality(idea_text, keywords):
    """Classify how well-formed the idea description is."""
    word_count = len(idea_text.split())
    kw_count = len(keywords) if keywords else 0
    sentence_count = max(1, idea_text.count('.') + idea_text.count('!') + idea_text.count('?'))

    if word_count < 8:
        return 'Vague'
    elif word_count < 25:
        return 'Basic'
    elif word_count < 80 or sentence_count < 3:
        return 'Good'
    else:
        return 'Detailed'


def _get_improvement_tips(idea_quality, idea_text, scores):
    """Generate tips to improve the idea description based on weak areas."""
    tips = []

    word_count = len(idea_text.split())

    if idea_quality in ('Vague', 'Basic'):
        tips.append('💬 Add more detail — describe the problem you solve, who your users are, and your unique approach.')

    if word_count < 20:
        tips.append('📏 Your description is very short. Aim for at least 3-4 sentences for a thorough analysis.')

    if scores.get('market_signals', 0) < 0.3:
        tips.append('📊 Mention your revenue model, target customers, or market size to boost your market signals score.')

    if scores.get('innovation', 0) < 0.35:
        tips.append('💡 Highlight what makes your idea unique — any novel technology, approach, or differentiation.')

    if scores.get('feasibility', 0) < 0.25:
        tips.append('⚙️ Describe your execution plan — MVP strategy, team, partnerships, or launch timeline.')

    if scores.get('keyword_diversity', 0) < 0.5:
        tips.append('🔑 Use more specific, diverse terms to describe your concept\'s different aspects.')

    return tips


def score_idea(idea_text, keywords=None, category=None):
    """Score an idea on a 0-10 scale with detailed breakdown.
    Uses real market data + smart sector auto-detection.
    Now includes explanations and vague-idea handling."""
    detail = []
    scores = {}
    explanations = {}

    # Auto-detect sector from idea text if not provided
    detected_sector = category
    try:
        from backend.services.market_intelligence_service import auto_detect_sector, detect_all_sectors
        if not detected_sector or detected_sector == 'General':
            detected_sector = auto_detect_sector(idea_text)
        related_sectors = detect_all_sectors(idea_text, top_n=3)
    except Exception:
        detected_sector = category or 'General'
        related_sectors = [(detected_sector, 0)]

    # Classify idea quality
    idea_quality = _classify_idea_quality(idea_text, keywords)

    # ── 1. Keyword diversity (max 1.5) ──
    kw_count = len(keywords) if keywords else 0
    kw_score = min(kw_count * 0.25, 1.5)
    scores['keyword_diversity'] = round(kw_score, 2)
    detail.append(f"{kw_count} keywords → +{scores['keyword_diversity']}")
    explanations['keyword_diversity'] = (
        f"Found {kw_count} unique keyword(s) in your description. "
        f"{'Great diversity!' if kw_count >= 6 else 'Adding more specific terms could improve this score.' if kw_count < 4 else 'Decent keyword coverage.'}"
    )

    # ── 2. Description quality (max 1.5) ──
    word_count = len(idea_text.split())
    sentence_count = max(1, idea_text.count('.') + idea_text.count('!') + idea_text.count('?'))
    avg_sentence_len = word_count / sentence_count
    depth_raw = word_count * 0.03
    structure_bonus = 0.3 if 5 <= avg_sentence_len <= 25 else 0
    depth_score = min(depth_raw + structure_bonus, 1.5)
    scores['description_quality'] = round(depth_score, 2)
    detail.append(f"{word_count} words, {sentence_count} sentences → +{scores['description_quality']}")
    explanations['description_quality'] = (
        f"Your description has {word_count} words across {sentence_count} sentence(s). "
        f"{'Excellent depth and structure!' if depth_score >= 1.2 else 'Good detail level.' if depth_score >= 0.6 else 'Consider adding more detail about your concept, target users, and approach.'}"
    )

    # ── 3. Market-signal words (max 1.5) ──
    market_words = [
        'market', 'revenue', 'customer', 'user', 'growth', 'scale',
        'profit', 'demand', 'opportunity', 'competitive', 'disruption',
        'monetize', 'subscription', 'saas', 'platform', 'b2b', 'b2c',
        'roi', 'acquisition', 'retention', 'churn', 'valuation',
        'pricing', 'freemium', 'enterprise', 'smb', 'tam', 'sam',
        'cac', 'ltv', 'mrr', 'arr', 'unit economics', 'burn rate',
        'runway', 'series', 'funding', 'investors', 'pitch',
        'traction', 'pmf', 'product-market fit', 'go-to-market',
    ]
    text_lower = idea_text.lower()
    market_hits = [w for w in market_words if w in text_lower]
    hits = len(market_hits)
    market_score = min(hits * 0.2, 1.5)
    scores['market_signals'] = round(market_score, 2)
    detail.append(f"{hits} market signals → +{scores['market_signals']}")
    explanations['market_signals'] = (
        f"Detected {hits} market/business term(s){': ' + ', '.join(market_hits[:5]) if market_hits else ''}. "
        f"{'Strong market awareness!' if hits >= 5 else 'Mentioning revenue model, target customers, or market size would strengthen this.' if hits < 2 else 'Good business awareness.'}"
    )

    # ── 4. Innovation signals (max 1.5) ──
    innovation_words = [
        'ai', 'ml', 'blockchain', 'iot', 'vr', 'ar', 'quantum',
        'automation', 'intelligent', 'novel', 'innovative', 'patent',
        'breakthrough', 'first-of-its-kind', 'unique', 'deep-learning',
        'neural', 'generative', 'autonomous', 'edge-computing',
        'disruptive', 'proprietary', 'algorithm', 'realtime', 'real-time',
        'personalized', 'adaptive', 'predictive', 'smart', 'next-gen',
    ]
    inn_hits_list = [w for w in innovation_words if w in text_lower]
    inn_hits = len(inn_hits_list)
    inn_score = min(inn_hits * 0.35, 1.5)
    scores['innovation'] = round(inn_score, 2)
    detail.append(f"{inn_hits} innovation signals → +{scores['innovation']}")
    explanations['innovation'] = (
        f"Found {inn_hits} innovation indicator(s){': ' + ', '.join(inn_hits_list[:5]) if inn_hits_list else ''}. "
        f"{'Highly innovative concept!' if inn_hits >= 4 else 'Highlighting unique technology or novel approaches would boost this.' if inn_hits < 2 else 'Shows good innovation potential.'}"
    )

    # ── 5. Feasibility signals (max 1.0) ──
    feasibility_words = [
        'mvp', 'prototype', 'beta', 'pilot', 'launch', 'roadmap',
        'milestone', 'timeline', 'team', 'co-founder', 'advisor',
        'partnership', 'integration', 'api', 'sdk', 'open-source',
        'scalable', 'modular', 'cloud-native', 'microservices',
        'cost-effective', 'lean', 'agile', 'sprint', 'iterate',
    ]
    feas_hits_list = [w for w in feasibility_words if w in text_lower]
    feas_hits = len(feas_hits_list)
    feas_score = min(feas_hits * 0.25, 1.0)
    scores['feasibility'] = round(feas_score, 2)
    detail.append(f"{feas_hits} feasibility signals → +{scores['feasibility']}")
    explanations['feasibility'] = (
        f"Detected {feas_hits} feasibility signal(s){': ' + ', '.join(feas_hits_list[:5]) if feas_hits_list else ''}. "
        f"{'Strong execution planning!' if feas_hits >= 3 else 'Describing your MVP plan, team, or go-to-market strategy would improve this.' if feas_hits < 1 else 'Shows execution awareness.'}"
    )

    # ── 6. Market alignment from real stock data (max 1.5) ──
    market_align = 0.75  # default
    try:
        from backend.services.market_intelligence_service import get_market_alignment_score
        market_align = min(get_market_alignment_score(detected_sector, idea_text), 1.5)
    except Exception:
        pass
    scores['market_alignment'] = round(market_align, 2)
    detail.append(f"Market alignment ({detected_sector}) → +{scores['market_alignment']}")
    explanations['market_alignment'] = (
        f"Your idea was mapped to the '{detected_sector}' sector. "
        f"Market alignment score: {scores['market_alignment']}/1.5 based on real sector performance data."
    )

    # ── 7. Market trend bonus from real data (max 1.0) ──
    trend_bonus = 0.5  # default
    try:
        from backend.services.market_intelligence_service import get_market_trend_bonus
        trend_bonus = get_market_trend_bonus(detected_sector, idea_text)
    except Exception:
        pass
    scores['market_trend'] = round(trend_bonus, 2)
    detail.append(f"Market trend bonus → +{scores['market_trend']}")
    explanations['market_trend'] = (
        f"The '{detected_sector}' sector received a trend bonus of {scores['market_trend']}/1.0 "
        f"based on recent stock market performance."
    )

    # ── Total (min 2.0 baseline for any submission, max 10.0) ──
    raw_total = sum(scores.values())
    # Apply baseline for vague ideas so they always get useful output
    if idea_quality == 'Vague':
        total = max(round(raw_total, 2), 2.0)
    elif idea_quality == 'Basic':
        total = max(round(raw_total, 2), 2.5)
    else:
        total = round(raw_total, 2)
    total = min(total, 10.0)

    # Generate improvement tips for weaker ideas
    improvement_tips = _get_improvement_tips(idea_quality, idea_text, scores)

    return {
        'score': total,
        'detail': detail,
        'breakdown': scores,
        'explanations': explanations,
        'detected_sector': detected_sector,
        'related_sectors': [s[0] for s in related_sectors] if related_sectors else [],
        'idea_quality': idea_quality,
        'improvement_tips': improvement_tips,
        'dimension_info': DIMENSION_INFO,
    }
