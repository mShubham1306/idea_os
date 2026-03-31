$script:PYTHONPATH = "c:\Users\nayan\Desktop\project-1"
$env:PYTHONPATH = $PYTHONPATH
cd "c:\Users\nayan\Desktop\project-1"
& "c:\Users\nayan\Desktop\project-1\backend\venv\Scripts\python.exe" -c "
import sys; sys.path.insert(0, 'c:\\Users\\nayan\\Desktop\\project-1')
from backend.app import create_app
app = create_app()
print('Starting Flask server on http://0.0.0.0:5000')
app.run(debug=True, use_reloader=False)
"
