from flask import Blueprint, request, jsonify
from backend.controllers.idea_controller import analyze_idea, get_history

idea_bp = Blueprint('idea', __name__)


@idea_bp.route('/analyze', methods=['POST'])
def analyze():
    # support JSON or multipart form-data with file (field 'audio')
    # if an audio file is included, it is passed to the controller for
    # transcription before analysis
    idea_text = None
    category = None
    audio_bytes = None
    audio_filename = None

    if request.content_type and request.content_type.startswith('multipart/form-data'):
        # file upload
        file = request.files.get('audio')
        if file:
            audio_bytes = file.read()
            audio_filename = file.filename
        idea_text = request.form.get('idea') or request.form.get('description')
        category = request.form.get('category')
    else:
        payload = request.get_json() or {}
        idea_text = payload.get('idea') or payload.get('description')
        category = payload.get('category')

    result = analyze_idea(idea_text, category, audio_bytes=audio_bytes, audio_filename=audio_filename)
    return jsonify(result)


@idea_bp.route('/history', methods=['GET'])
def history():
    data = get_history()
    return jsonify(data)
