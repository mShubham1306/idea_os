@echo off
cd /d "%~dp0\.."
set PYTHONPATH=%CD%
"%CD%\backend\venv\Scripts\python.exe" -c "from backend.app import create_app; app = create_app(); app.run(host='0.0.0.0', port=5000, debug=True)"
