$script:PYTHONPATH = $PSScriptRoot
$env:PYTHONPATH = $PYTHONPATH
cd $PSScriptRoot
& "$PSScriptRoot\backend\venv\Scripts\python.exe" -c "
import sys; sys.path.insert(0, '$PSScriptRoot')
from backend.app import create_app
app = create_app()
print('Starting Flask server on http://0.0.0.0:5000')
app.run(debug=True, use_reloader=False)
"
