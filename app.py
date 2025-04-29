from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
import json
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads', 'photos')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_atlas_file():
    data_file = os.path.join('static', 'data', 'atlas.json')
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump({"conversations": [], "visited_regions": []}, f)
    return data_file

def ensure_cultural_items_file():
    data_file = os.path.join('static', 'data', 'cultural_items.json')
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump({"items": []}, f)
    return data_file

def ensure_user_items_file():
    data_file = os.path.join('static', 'data', 'user_items.json')
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump({"user_items": []}, f)
    return data_file

def ensure_badges_file():
    data_file = os.path.join('static', 'data', 'badges.json')
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump({"badges": []}, f)
    return data_file

def ensure_favorite_countries_file():
    data_file = os.path.join('static', 'data', 'favorite_countries.json')
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump({"favorites": []}, f)
    return data_file

def load_atlas_data():
    data_file = ensure_atlas_file()
    with open(data_file, 'r') as f:
        return json.load(f)

def save_atlas_data(data):
    data_file = ensure_atlas_file()
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)

def load_cultural_items():
    data_file = ensure_cultural_items_file()
    with open(data_file, 'r') as f:
        return json.load(f)

def save_cultural_items(data):
    data_file = ensure_cultural_items_file()
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)

def load_user_items():
    data_file = ensure_user_items_file()
    with open(data_file, 'r') as f:
        return json.load(f)

def save_user_items(data):
    data_file = ensure_user_items_file()
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)

def load_badges():
    data_file = ensure_badges_file()
    with open(data_file, 'r') as f:
        return json.load(f)

def save_badges(data):
    data_file = ensure_badges_file()
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)

def load_favorite_countries():
    data_file = ensure_favorite_countries_file()
    with open(data_file, 'r') as f:
        return json.load(f)

def save_favorite_countries(data):
    data_file = ensure_favorite_countries_file()
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/avatar')
def avatar():
    return render_template('avatar.html')

@app.route('/api/atlas-data', methods=['GET'])
def get_atlas_data():
    atlas_data = load_atlas_data()
    return jsonify(atlas_data)

@app.route('/conversation/<conversation_id>')
def view_conversation(conversation_id):
    return render_template('conversation.html', conversation_id=conversation_id)

@app.route('/collection')
def collection():
    atlas_data = load_atlas_data()
    return render_template('collection.html', conversations=atlas_data['conversations'])

@app.route('/add-conversation', methods=['GET', 'POST'])
def add_conversation():
    if request.method == 'POST':
        atlas_data = load_atlas_data()
        
        new_id = str(uuid.uuid4())[:8]
        
        name = request.form['name']
        country = request.form['country']
        region = request.form['region']
        quote = request.form['quote']
        coordinates = [float(request.form['latitude']), float(request.form['longitude'])]
        
        photo_filename = None
        if 'photo' in request.files:
            photo = request.files['photo']
            if photo and allowed_file(photo.filename):
                filename = secure_filename(f"{new_id}_{photo.filename}")
                photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                photo.save(photo_path)
                photo_filename = os.path.join('uploads', 'photos', filename)
        
        new_conversation = {
            'id': new_id,
            'name': name,
            'country': country,
            'region': region,
            'quote': quote,
            'coordinates': coordinates,
            'photo_url': photo_filename,
            'date_added': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        atlas_data['conversations'].append(new_conversation)
        
        if region not in atlas_data['visited_regions']:
            atlas_data['visited_regions'].append(region)
        
        save_atlas_data(atlas_data)
        
        return redirect(url_for('index'))
    
    return render_template('add_conversation.html')

@app.route('/edit-conversation/<conversation_id>', methods=['GET', 'POST'])
def edit_conversation(conversation_id):
    atlas_data = load_atlas_data()
    
    conversation = None
    for conv in atlas_data['conversations']:
        if conv['id'] == conversation_id:
            conversation = conv
            break
    
    if not conversation:
        return redirect(url_for('collection'))
    
    if request.method == 'POST':
        conversation['name'] = request.form['name']
        conversation['country'] = request.form['country']
        
        old_region = conversation['region']
        new_region = request.form['region']
        conversation['region'] = new_region
        
        if old_region != new_region and new_region not in atlas_data['visited_regions']:
            atlas_data['visited_regions'].append(new_region)
        
        conversation['quote'] = request.form['quote']
        conversation['coordinates'] = [float(request.form['latitude']), float(request.form['longitude'])]
        
        if 'photo' in request.files:
            photo = request.files['photo']
            if photo and allowed_file(photo.filename):
                filename = secure_filename(f"{conversation_id}_{photo.filename}")
                photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                photo.save(photo_path)
                conversation['photo_url'] = os.path.join('uploads', 'photos', filename)
        
        save_atlas_data(atlas_data)
        
        return redirect(url_for('collection'))
    
    return render_template('edit_conversation.html', conversation=conversation)

@app.route('/delete-conversation/<conversation_id>', methods=['POST'])
def delete_conversation(conversation_id):
    atlas_data = load_atlas_data()
    
    region_to_check = None
    for conv in atlas_data['conversations']:
        if conv['id'] == conversation_id:
            region_to_check = conv['region']
            break
    
    atlas_data['conversations'] = [c for c in atlas_data['conversations'] if c['id'] != conversation_id]
    
    if region_to_check:
        region_still_exists = any(c['region'] == region_to_check for c in atlas_data['conversations'])
        if not region_still_exists and region_to_check in atlas_data['visited_regions']:
            atlas_data['visited_regions'].remove(region_to_check)
    
    save_atlas_data(atlas_data)
    
    return redirect(url_for('collection'))


@app.route('/gacha')
def gacha():
    return render_template('gacha.html')

@app.route('/api/cultural-items', methods=['GET'])
def get_cultural_items():
    cultural_items = load_cultural_items()
    return jsonify(cultural_items)

@app.route('/api/user-items', methods=['GET'])
def get_user_items():
    user_items = load_user_items()
    return jsonify(user_items)

@app.route('/api/add-user-item', methods=['POST'])
def add_user_item():
    data = request.json
    user_items = load_user_items()
    
    new_item = {
        'id': str(uuid.uuid4())[:8],
        'item_id': data['item_id'],
        'acquired_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'equipped': False
    }
    
    user_items['user_items'].append(new_item)
    save_user_items(user_items)
    
    return jsonify({'success': True, 'item': new_item})

@app.route('/api/badges', methods=['GET'])
def get_badges():
    badges = load_badges()
    return jsonify(badges)

@app.route('/api/user-badges', methods=['GET'])
def get_user_badges():
    badges = load_badges()
    return jsonify(badges)

@app.route('/api/favorite-countries', methods=['GET'])
def get_favorite_countries():
    favorites = load_favorite_countries()
    return jsonify(favorites)

@app.route('/api/set-favorite-country', methods=['POST'])
def set_favorite_country():
    data = request.json
    favorites = load_favorite_countries()
    
    existing = next((f for f in favorites['favorites'] if f['country_id'] == data['country_id']), None)
    
    if existing:
        existing['rank'] = data['rank']
    else:
        new_favorite = {
            'id': str(uuid.uuid4())[:8],
            'country_id': data['country_id'],
            'rank': data['rank'],
            'set_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        favorites['favorites'].append(new_favorite)
    
    save_favorite_countries(favorites)
    
    return jsonify({'success': True})

@app.route('/favorite-countries')
def favorite_countries():
    return render_template('favorite_countries.html')

@app.route('/badges')
def badges():
    return render_template('badges.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
