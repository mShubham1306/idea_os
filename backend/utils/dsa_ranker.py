def rank_keywords(keywords):
    # Simple ranking: assign weight by position
    ranked = {k: (len(keywords) - i) for i,k in enumerate(keywords)}
    return ranked
