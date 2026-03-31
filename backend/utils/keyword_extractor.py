from collections import Counter
import re

def extract_keywords(text, top_n=10):
    words = re.findall(r"\w+", text.lower())
    stopwords = set(['the','and','is','in','for','to','a','of','with','on','as','an'])
    filtered = [w for w in words if w not in stopwords and len(w) > 2]
    counts = Counter(filtered)
    return [w for w,_ in counts.most_common(top_n)]
