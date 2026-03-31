from flask import Flask
from flask_cors import CORS
from backend.Database.db import db
import os

def create_app():
	app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
	app.config.from_object('backend.config.Config')
	CORS(app, resources={r"/api/*": {"origins": "*"}})

	db.init_app(app)

	# Register blueprints
	try:
		# use package-qualified imports so modules load when app is run from project root
		from backend.routes.dashboard_routes import dashboard_bp
		from backend.routes.idea_routes import idea_bp
		from backend.routes.auth_routes import auth_bp
		from backend.routes.market_routes import market_bp

		app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
		app.register_blueprint(idea_bp, url_prefix='/api/idea')
		app.register_blueprint(auth_bp, url_prefix='/api/auth')
		app.register_blueprint(market_bp, url_prefix='/api/market')
	except Exception as e:
		# log or ignore; missing modules will prevent registration
		print('blueprint import error', e)

	# Auto-create database tables on startup
	with app.app_context():
		try:
			import backend.models.idea_model   # noqa: ensure models are registered
			import backend.models.report_model  # noqa
			db.create_all()
		except Exception as e:
			print('db create_all error', e)

	@app.route('/', defaults={'path': ''})
	@app.route('/<path:path>')
	def serve(path):
		import os
		if path != "" and os.path.exists(app.static_folder + '/' + path):
			return app.send_static_file(path)
		else:
			return app.send_static_file('index.html')

	return app


if __name__ == '__main__':
	app = create_app()
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port, debug=True)
