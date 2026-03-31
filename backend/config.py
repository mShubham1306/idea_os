import os
from dotenv import load_dotenv

# load .env from the backend directory
_backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_backend_dir, '.env'))

# absolute path for the SQLite database so it's always consistent
_default_db = 'sqlite:///' + os.path.join(_backend_dir, 'idea_os.db').replace('\\', '/')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', _default_db)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Connection pool settings — only for MySQL/PostgreSQL (SQLite uses NullPool)
    _uri = os.environ.get('DATABASE_URL', _default_db)
    if 'sqlite' not in _uri:
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_size': int(os.environ.get('DB_POOL_SIZE', 10)),
            'max_overflow': int(os.environ.get('DB_MAX_OVERFLOW', 20)),
        }
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {}

    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
