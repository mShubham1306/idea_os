"""
Market Intelligence Service — Global Multi-Sector Edition
Loads stock CSV data from the dataset/ folder and computes real sector
performance metrics. Provides smart category auto-detection and scoring
for ANY sector through fuzzy matching and industry benchmarks.
"""
import os
import csv
import math
import re
from functools import lru_cache

# ─── Ticker → Sector Mapping ──────────────────────────────────────
TICKER_SECTOR = {
    'AMZN': 'E-Commerce',
    'NVDA': 'AI/ML',
    'INTC': 'Hardware',
    'NFLX': 'Media',
    'SONY': 'Media',
    'CRM':  'SaaS',
    'MA':   'FinTech',
    'V':    'FinTech',
    'FDX':  'Logistics',
    'UPS':  'Logistics',
    'AKAM': 'SaaS',
    'LUMN': 'Telecom',
    'PARA': 'Media',
    'WBD':  'Media',
}

# ─── Global Sector Definitions (20+ sectors) ─────────────────────
# Each sector maps to relevant tracked sectors + industry benchmarks
GLOBAL_SECTORS = {
    # ── Tech & Software ──
    'AI/ML': {
        'tracked': ['AI/ML', 'SaaS'],
        'description': 'Artificial Intelligence & Machine Learning',
        'growth_multiplier': 1.4,
        'keywords': ['ai', 'ml', 'machine learning', 'deep learning', 'neural', 'nlp',
                     'computer vision', 'generative', 'llm', 'gpt', 'transformer',
                     'predictive', 'autonomous', 'intelligent'],
    },
    'SaaS': {
        'tracked': ['SaaS'],
        'description': 'Software as a Service',
        'growth_multiplier': 1.2,
        'keywords': ['saas', 'cloud', 'subscription', 'platform', 'api', 'dashboard',
                     'workflow', 'automation', 'integration', 'crm', 'erp'],
    },
    'Cybersecurity': {
        'tracked': ['SaaS', 'AI/ML'],
        'description': 'Cybersecurity & Data Protection',
        'growth_multiplier': 1.3,
        'keywords': ['security', 'cybersecurity', 'encryption', 'firewall', 'threat',
                     'vulnerability', 'compliance', 'authentication', 'zero-trust', 'soc'],
    },
    'DevTools': {
        'tracked': ['SaaS'],
        'description': 'Developer Tools & Infrastructure',
        'growth_multiplier': 1.15,
        'keywords': ['developer', 'devops', 'ci/cd', 'git', 'ide', 'code', 'api',
                     'sdk', 'framework', 'debugging', 'testing', 'deployment'],
    },
    'Cloud': {
        'tracked': ['SaaS', 'Hardware'],
        'description': 'Cloud Computing & Infrastructure',
        'growth_multiplier': 1.25,
        'keywords': ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'kubernetes',
                     'docker', 'microservices', 'iaas', 'paas', 'edge computing'],
    },
    'Blockchain': {
        'tracked': ['FinTech', 'SaaS'],
        'description': 'Blockchain & Web3',
        'growth_multiplier': 1.1,
        'keywords': ['blockchain', 'crypto', 'web3', 'defi', 'nft', 'smart contract',
                     'decentralized', 'token', 'dao', 'ethereum', 'solana', 'wallet'],
    },

    # ── Finance ──
    'FinTech': {
        'tracked': ['FinTech'],
        'description': 'Financial Technology',
        'growth_multiplier': 1.2,
        'keywords': ['fintech', 'payments', 'banking', 'lending', 'insurance',
                     'investment', 'trading', 'wallet', 'credit', 'neobank', 'remittance'],
    },
    'InsurTech': {
        'tracked': ['FinTech', 'SaaS'],
        'description': 'Insurance Technology',
        'growth_multiplier': 1.1,
        'keywords': ['insurance', 'insurtech', 'claims', 'underwriting', 'policy',
                     'risk assessment', 'actuary', 'coverage', 'premium'],
    },
    'WealthTech': {
        'tracked': ['FinTech'],
        'description': 'Wealth & Investment Technology',
        'growth_multiplier': 1.15,
        'keywords': ['wealth', 'investment', 'portfolio', 'robo-advisor', 'trading',
                     'stocks', 'mutual funds', 'retirement', 'financial planning'],
    },

    # ── Health & Life Sciences ──
    'HealthTech': {
        'tracked': ['SaaS', 'AI/ML'],
        'description': 'Healthcare Technology',
        'growth_multiplier': 1.3,
        'keywords': ['health', 'healthcare', 'medical', 'clinical', 'patient', 'hospital',
                     'telemedicine', 'ehr', 'diagnosis', 'wearable', 'wellness', 'pharma'],
    },
    'BioTech': {
        'tracked': ['AI/ML', 'Hardware'],
        'description': 'Biotechnology & Genomics',
        'growth_multiplier': 1.25,
        'keywords': ['biotech', 'genomics', 'dna', 'gene', 'therapeutic', 'drug',
                     'clinical trial', 'molecular', 'crispr', 'protein', 'bioinformatics'],
    },
    'MedTech': {
        'tracked': ['Hardware', 'SaaS'],
        'description': 'Medical Devices & Diagnostics',
        'growth_multiplier': 1.2,
        'keywords': ['medical device', 'diagnostic', 'imaging', 'surgical', 'prosthetic',
                     'monitoring', 'ultrasound', 'mri', 'implant', 'lab equipment'],
    },

    # ── Commerce & Consumer ──
    'E-Commerce': {
        'tracked': ['E-Commerce', 'Logistics'],
        'description': 'Electronic Commerce',
        'growth_multiplier': 1.1,
        'keywords': ['ecommerce', 'e-commerce', 'marketplace', 'shop', 'retail',
                     'cart', 'checkout', 'product', 'seller', 'buyer', 'dropshipping'],
    },
    'D2C': {
        'tracked': ['E-Commerce'],
        'description': 'Direct to Consumer',
        'growth_multiplier': 1.05,
        'keywords': ['d2c', 'direct to consumer', 'brand', 'consumer', 'cpg',
                     'subscription box', 'lifestyle', 'personal care'],
    },
    'FoodTech': {
        'tracked': ['E-Commerce', 'Logistics'],
        'description': 'Food Technology & Delivery',
        'growth_multiplier': 1.1,
        'keywords': ['food', 'delivery', 'restaurant', 'meal', 'recipe', 'grocery',
                     'kitchen', 'nutrition', 'organic', 'vegan', 'plant-based', 'chef'],
    },
    'Fashion': {
        'tracked': ['E-Commerce', 'Media'],
        'description': 'Fashion & Apparel Tech',
        'growth_multiplier': 0.95,
        'keywords': ['fashion', 'apparel', 'clothing', 'wear', 'style', 'designer',
                     'textile', 'sustainable fashion', 'luxury', 'accessories'],
    },

    # ── Education ──
    'EdTech': {
        'tracked': ['SaaS', 'AI/ML'],
        'description': 'Education Technology',
        'growth_multiplier': 1.2,
        'keywords': ['education', 'learning', 'course', 'student', 'teacher', 'school',
                     'university', 'tutoring', 'syllabus', 'e-learning', 'lms', 'mooc',
                     'gamification', 'skill', 'training', 'certification'],
    },

    # ── Property & Real Estate ──
    'PropTech': {
        'tracked': ['FinTech', 'SaaS'],
        'description': 'Property Technology',
        'growth_multiplier': 1.05,
        'keywords': ['property', 'real estate', 'rental', 'mortgage', 'tenant',
                     'landlord', 'valuation', 'listing', 'construction', 'architecture'],
    },
    'ConTech': {
        'tracked': ['Hardware', 'SaaS'],
        'description': 'Construction Technology',
        'growth_multiplier': 1.1,
        'keywords': ['construction', 'building', 'architecture', 'blueprint', 'concrete',
                     'structural', 'civil engineering', 'bim', 'modular'],
    },

    # ── Energy & Environment ──
    'GreenTech': {
        'tracked': ['Logistics', 'Hardware'],
        'description': 'Green & Clean Technology',
        'growth_multiplier': 1.35,
        'keywords': ['green', 'renewable', 'solar', 'wind', 'energy', 'carbon',
                     'sustainability', 'recycling', 'electric', 'ev', 'battery',
                     'clean energy', 'emission', 'climate', 'net-zero'],
    },
    'CleanTech': {
        'tracked': ['Hardware', 'Logistics'],
        'description': 'Clean Technology & Waste Management',
        'growth_multiplier': 1.3,
        'keywords': ['waste', 'pollution', 'water treatment', 'air quality', 'recycling',
                     'circular economy', 'composting', 'hazardous', 'environmental'],
    },

    # ── Agriculture ──
    'AgriTech': {
        'tracked': ['Hardware', 'Logistics'],
        'description': 'Agriculture Technology',
        'growth_multiplier': 1.15,
        'keywords': ['agriculture', 'farming', 'crop', 'irrigation', 'soil', 'harvest',
                     'livestock', 'precision agriculture', 'agronomy', 'fertilizer',
                     'drone', 'vertical farming', 'hydroponics', 'aquaponics'],
    },

    # ── Mobility & Transport ──
    'Mobility': {
        'tracked': ['Logistics', 'Hardware'],
        'description': 'Mobility & Transportation',
        'growth_multiplier': 1.15,
        'keywords': ['mobility', 'transport', 'vehicle', 'car', 'ride', 'fleet',
                     'autonomous driving', 'ev', 'scooter', 'bike', 'parking',
                     'navigation', 'trucking', 'shipping', 'freight'],
    },
    'SpaceTech': {
        'tracked': ['Hardware', 'AI/ML'],
        'description': 'Space Technology',
        'growth_multiplier': 1.4,
        'keywords': ['space', 'satellite', 'rocket', 'orbit', 'launch', 'astronaut',
                     'aerospace', 'nasa', 'spacex', 'payload', 'mars'],
    },

    # ── Media & Entertainment ──
    'Media': {
        'tracked': ['Media'],
        'description': 'Media & Entertainment',
        'growth_multiplier': 0.9,
        'keywords': ['media', 'content', 'streaming', 'video', 'music', 'podcast',
                     'entertainment', 'gaming', 'film', 'animation', 'creator',
                     'influencer', 'social media', 'youtube', 'tiktok'],
    },
    'Gaming': {
        'tracked': ['Media', 'AI/ML'],
        'description': 'Gaming & Interactive Entertainment',
        'growth_multiplier': 1.15,
        'keywords': ['gaming', 'game', 'esports', 'vr', 'ar', 'metaverse', 'play',
                     'console', 'mobile game', 'multiplayer', 'unity', 'unreal'],
    },

    # ── Telecom & Connectivity ──
    'Telecom': {
        'tracked': ['Telecom', 'Hardware'],
        'description': 'Telecommunications',
        'growth_multiplier': 1.0,
        'keywords': ['telecom', '5g', 'network', 'broadband', 'fiber', 'wireless',
                     'iot', 'connectivity', 'spectrum', 'tower', 'satellite internet'],
    },

    # ── HR & Workforce ──
    'HRTech': {
        'tracked': ['SaaS'],
        'description': 'HR & Workforce Technology',
        'growth_multiplier': 1.1,
        'keywords': ['hr', 'hiring', 'recruitment', 'employee', 'payroll', 'talent',
                     'workforce', 'onboarding', 'performance', 'benefits', 'compensation'],
    },

    # ── Legal ──
    'LegalTech': {
        'tracked': ['SaaS', 'AI/ML'],
        'description': 'Legal Technology',
        'growth_multiplier': 1.15,
        'keywords': ['legal', 'law', 'contract', 'compliance', 'regulation', 'patent',
                     'litigation', 'attorney', 'court', 'trademark', 'intellectual property'],
    },

    # ── Travel & Hospitality ──
    'TravelTech': {
        'tracked': ['E-Commerce', 'Media'],
        'description': 'Travel & Hospitality',
        'growth_multiplier': 1.05,
        'keywords': ['travel', 'hotel', 'booking', 'flight', 'tourism', 'hospitality',
                     'vacation', 'resort', 'airbnb', 'restaurant', 'destination'],
    },

    # ── Social Impact ──
    'SocialImpact': {
        'tracked': ['SaaS'],
        'description': 'Social Impact & Non-profit Tech',
        'growth_multiplier': 1.0,
        'keywords': ['social', 'impact', 'non-profit', 'donation', 'charity', 'ngo',
                     'community', 'volunteer', 'humanitarian', 'welfare', 'inclusion'],
    },

    # ── Robotics & Manufacturing ──
    'Robotics': {
        'tracked': ['Hardware', 'AI/ML'],
        'description': 'Robotics & Industrial Automation',
        'growth_multiplier': 1.3,
        'keywords': ['robot', 'robotics', 'automation', 'manufacturing', 'industrial',
                     'warehouse', 'assembly', 'cnc', '3d printing', 'additive',
                     'cobot', 'drone', 'sensor', 'actuator'],
    },

    # ── Data & Analytics ──
    'DataTech': {
        'tracked': ['SaaS', 'AI/ML'],
        'description': 'Data Analytics & Business Intelligence',
        'growth_multiplier': 1.2,
        'keywords': ['data', 'analytics', 'business intelligence', 'dashboard',
                     'visualization', 'big data', 'data warehouse', 'etl', 'pipeline',
                     'metrics', 'reporting', 'insights'],
    },

    # ── Catch-all ──
    'General': {
        'tracked': ['SaaS', 'E-Commerce'],
        'description': 'General / Multi-sector',
        'growth_multiplier': 1.0,
        'keywords': [],
    },
}

DATASET_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'dataset')
)


# ─── Auto-detect sector from idea text ────────────────────────────
def auto_detect_sector(idea_text):
    """Detect the best-matching sector from idea text using keyword scoring."""
    text_lower = idea_text.lower()
    words = set(re.findall(r'\w+', text_lower))

    scores = {}
    for sector_name, sector_info in GLOBAL_SECTORS.items():
        if sector_name == 'General':
            continue
        score = 0
        for kw in sector_info['keywords']:
            # Multi-word keyword matching
            if ' ' in kw:
                if kw in text_lower:
                    score += 3  # multi-word matches are more specific
            elif kw in words:
                score += 1
        if score > 0:
            scores[sector_name] = score

    if not scores:
        return 'General'

    # Return top match
    return max(scores, key=scores.get)


def detect_all_sectors(idea_text, top_n=3):
    """Detect top N matching sectors for cross-sector analysis."""
    text_lower = idea_text.lower()
    words = set(re.findall(r'\w+', text_lower))

    scores = {}
    for sector_name, sector_info in GLOBAL_SECTORS.items():
        if sector_name == 'General':
            continue
        score = 0
        for kw in sector_info['keywords']:
            if ' ' in kw:
                if kw in text_lower:
                    score += 3
            elif kw in words:
                score += 1
        if score > 0:
            scores[sector_name] = score

    if not scores:
        return [('General', 0)]

    sorted_sectors = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_sectors[:top_n]


# ─── CSV Loading & Metrics ────────────────────────────────────────
def _load_csv(filepath):
    """Load a stock CSV and return list of dicts with float values."""
    rows = []
    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                rows.append({
                    'date': row['Date'],
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': float(row['Volume']),
                })
            except (ValueError, KeyError):
                continue
    return rows


def _compute_metrics(rows):
    """Compute financial metrics from OHLCV rows."""
    if len(rows) < 2:
        return None

    closes = [r['close'] for r in rows]
    volumes = [r['volume'] for r in rows]

    # Daily returns
    daily_returns = []
    for i in range(1, len(closes)):
        if closes[i - 1] > 0:
            daily_returns.append((closes[i] - closes[i - 1]) / closes[i - 1])

    if not daily_returns:
        return None

    avg_daily_return = sum(daily_returns) / len(daily_returns)
    annualized_return = avg_daily_return * 252
    volatility = math.sqrt(
        sum((r - avg_daily_return) ** 2 for r in daily_returns) / len(daily_returns)
    ) * math.sqrt(252)

    # Recent performance
    recent_window = min(252, len(closes))
    recent_start = closes[-recent_window]
    recent_end = closes[-1]
    recent_growth = ((recent_end - recent_start) / recent_start) * 100 if recent_start > 0 else 0

    # Trend direction (last 60 days)
    trend_window = min(60, len(closes))
    trend_start = closes[-trend_window]
    trend_end = closes[-1]
    trend = 'up' if trend_end > trend_start else 'down' if trend_end < trend_start else 'flat'

    # All-time growth
    total_growth = ((closes[-1] - closes[0]) / closes[0]) * 100 if closes[0] > 0 else 0

    # Sharpe-like ratio (risk-adjusted return)
    sharpe = (annualized_return / volatility) if volatility > 0 else 0

    return {
        'latest_price': round(closes[-1], 2),
        'annualized_return': round(annualized_return * 100, 2),
        'volatility': round(volatility * 100, 2),
        'recent_growth_pct': round(recent_growth, 2),
        'total_growth_pct': round(total_growth, 2),
        'sharpe_ratio': round(sharpe, 3),
        'trend': trend,
        'avg_volume': round(sum(volumes[-30:]) / min(30, len(volumes)), 0),
        'data_points': len(rows),
        'date_range': f"{rows[0]['date']} — {rows[-1]['date']}",
    }


@lru_cache(maxsize=1)
def get_all_ticker_metrics():
    """Load every CSV and compute per-ticker metrics."""
    results = {}
    if not os.path.isdir(DATASET_DIR):
        return results

    for fname in os.listdir(DATASET_DIR):
        if not fname.endswith('.csv'):
            continue
        ticker = fname.replace('_daily_data.csv', '')
        filepath = os.path.join(DATASET_DIR, fname)
        rows = _load_csv(filepath)
        metrics = _compute_metrics(rows)
        if metrics:
            metrics['ticker'] = ticker
            metrics['sector'] = TICKER_SECTOR.get(ticker, 'Other')
            results[ticker] = metrics

    return results


def get_sector_summary():
    """Aggregate ticker metrics into tracked-sector-level summaries."""
    ticker_data = get_all_ticker_metrics()
    sectors = {}

    for ticker, m in ticker_data.items():
        sector = m['sector']
        if sector not in sectors:
            sectors[sector] = {
                'tickers': [],
                'returns': [],
                'volatilities': [],
                'growths': [],
                'sharpes': [],
                'trends_up': 0,
                'trends_total': 0,
            }
        s = sectors[sector]
        s['tickers'].append(ticker)
        s['returns'].append(m['annualized_return'])
        s['volatilities'].append(m['volatility'])
        s['growths'].append(m['recent_growth_pct'])
        s['sharpes'].append(m['sharpe_ratio'])
        s['trends_total'] += 1
        if m['trend'] == 'up':
            s['trends_up'] += 1

    summary = {}
    for sector, s in sectors.items():
        n = len(s['returns'])
        summary[sector] = {
            'sector': sector,
            'tickers': s['tickers'],
            'avg_annualized_return': round(sum(s['returns']) / n, 2),
            'avg_volatility': round(sum(s['volatilities']) / n, 2),
            'avg_recent_growth': round(sum(s['growths']) / n, 2),
            'avg_sharpe': round(sum(s['sharpes']) / n, 3),
            'trend_bullish_pct': round((s['trends_up'] / s['trends_total']) * 100, 1),
            'health_score': _sector_health(
                sum(s['returns']) / n,
                sum(s['volatilities']) / n,
                sum(s['growths']) / n,
                s['trends_up'] / s['trends_total'],
            ),
        }

    return summary


def _sector_health(avg_return, avg_vol, avg_growth, trend_ratio):
    """Compute a 0-100 health score for a sector."""
    score = 50
    score += min(avg_return * 0.5, 20)
    score -= min(avg_vol * 0.1, 15)
    score += min(avg_growth * 0.2, 15)
    score += trend_ratio * 10
    return round(max(0, min(100, score)), 1)


# ─── Scoring Functions for ANY sector ─────────────────────────────
def get_market_alignment_score(category, idea_text=None):
    """Return a 0-2.0 score based on real market data.
    Works for ALL sectors by mapping through GLOBAL_SECTORS."""
    # Auto-detect if no category
    if not category or category == 'General':
        if idea_text:
            category = auto_detect_sector(idea_text)

    sector_data = get_sector_summary()
    sector_info = GLOBAL_SECTORS.get(category, GLOBAL_SECTORS['General'])
    tracked = sector_info['tracked']
    multiplier = sector_info.get('growth_multiplier', 1.0)

    health_scores = []
    for sec in tracked:
        if sec in sector_data:
            health_scores.append(sector_data[sec]['health_score'])

    if not health_scores:
        return 1.0  # neutral fallback

    avg_health = sum(health_scores) / len(health_scores)
    raw_score = (avg_health / 100) * 2.0 * multiplier
    return round(min(raw_score, 2.0), 2)


def get_market_trend_bonus(category, idea_text=None):
    """Return a 0-1.0 bonus for ideas in sectors with bullish recent trends."""
    if not category or category == 'General':
        if idea_text:
            category = auto_detect_sector(idea_text)

    sector_data = get_sector_summary()
    sector_info = GLOBAL_SECTORS.get(category, GLOBAL_SECTORS['General'])
    tracked = sector_info['tracked']

    growth_rates = []
    for sec in tracked:
        if sec in sector_data:
            growth_rates.append(sector_data[sec]['avg_recent_growth'])

    if not growth_rates:
        return 0.5

    avg_growth = sum(growth_rates) / len(growth_rates)
    bonus = max(0, min(1.0, (avg_growth + 10) / 30))
    return round(bonus, 2)


def get_sector_detail(category, idea_text=None):
    """Return rich sector context for the analysis page."""
    if not category or category == 'General':
        if idea_text:
            category = auto_detect_sector(idea_text)

    sector_info = GLOBAL_SECTORS.get(category, GLOBAL_SECTORS['General'])
    sector_data = get_sector_summary()
    tracked = sector_info['tracked']

    relevant_data = {}
    for sec in tracked:
        if sec in sector_data:
            relevant_data[sec] = sector_data[sec]

    return {
        'detected_sector': category,
        'description': sector_info['description'],
        'growth_outlook': sector_info['growth_multiplier'],
        'tracked_sectors': tracked,
        'market_data': relevant_data,
    }


# ─── API Data ─────────────────────────────────────────────────────
def get_market_summary_for_api():
    """Return a full market overview for the frontend API."""
    ticker_data = get_all_ticker_metrics()
    sector_data = get_sector_summary()

    all_health = [s['health_score'] for s in sector_data.values()]
    overall_health = round(sum(all_health) / len(all_health), 1) if all_health else 50

    sorted_tickers = sorted(ticker_data.values(), key=lambda x: x['recent_growth_pct'], reverse=True)
    top_performers = sorted_tickers[:5]
    bottom_performers = sorted_tickers[-3:]

    # All available global sectors
    global_sectors_list = [
        {
            'name': name,
            'description': info['description'],
            'growth_outlook': info['growth_multiplier'],
            'tracked_by': info['tracked'],
            'keyword_count': len(info['keywords']),
        }
        for name, info in GLOBAL_SECTORS.items()
        if name != 'General'
    ]

    return {
        'overall_health': overall_health,
        'total_tickers': len(ticker_data),
        'total_tracked_sectors': len(sector_data),
        'total_global_sectors': len(GLOBAL_SECTORS) - 1,  # exclude General
        'sectors': sector_data,
        'global_sectors': global_sectors_list,
        'top_performers': top_performers,
        'bottom_performers': bottom_performers,
        'all_tickers': ticker_data,
    }
