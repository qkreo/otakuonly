from datetime import datetime

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/page', methods=['GET'])
def show_page():
    pages = list(db.page.find({}, {'_id': False}))
    return jsonify({'all_page': pages})

@app.route('/page', methods=['POST'])
def save_page():
    title_receive = request.form['title_give']
    content_receive = request.form['content_give']
    star_receive = request.form['star_give']
    genre_receive = request.form['genre_give']

    file = request.files["file_give"]

    extension = file.filename.split('.')[-1]

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
    savetime = today.strftime('%Y-%m-%d')

    filename = f'file-{mytime}'

    save_to = f'static/{filename}.{extension}'
    file.save(save_to)

    doc = {
        'title':title_receive,
        'content':content_receive,
        'star':star_receive,
        'file': f'{filename}.{extension}',
        'genre':genre_receive,
        'time': savetime
    }

    db.page.insert_one(doc)

    return jsonify({'msg': '작성 완료!'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
