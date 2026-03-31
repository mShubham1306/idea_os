# helper script to initialize the database tables
# can be run as a script or module

try:
    # when executed from workspace root
    from backend.app import create_app
    from backend.Database.db import db
except ImportError:
    # when executed from within backend directory
    from app import create_app  # type: ignore
    from Database.db import db  # type: ignore


def main():
    app = create_app()
    with app.app_context():
        db.create_all()
        print('Database tables created')


if __name__ == '__main__':
    main()
