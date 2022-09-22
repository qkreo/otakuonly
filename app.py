import json

from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

import certifi
ca = certifi.where()


app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient("mongodb+srv://qkero407:Qvr1Wt574O3CdofS@cluster0.iao4kcr.mongodb.net/?retryWrites=true&w=majority",tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
    posts = list(db.page.find({}, {"_id": False}))
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template('index.html', user_info=user_info, posts=posts)

    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="먼저 로그인 해 주시기 바랍니다"))

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': username_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')#접속 오류 .decode('utf-8')

        return jsonify({'result': 'success', 'token': token,'msg':'접속을환영합니다'})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    profile_name_receive = request.form['profile_name_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,                               # 아이디
        "password": password_hash,                                  # 비밀번호
        "profile_name": profile_name_receive,                       # 프로필 이름 기본값은 닉네임
        "profile_pic": "",                                          # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png", # 프로필 사진 기본 이미지
        "profile_info": ""                                          # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/update_profile', methods=['POST'])
def save_img():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        username = payload["id"]
        name_receive = request.form["name_give"]
        about_receive = request.form["about_give"]
        new_doc = {
            "profile_name": name_receive,
            "profile_info": about_receive
        }
        if 'file_give' in request.files:
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"profile_pics/{username}.{extension}"
            file.save("./static/"+file_path)
            new_doc["profile_pic"] = filename
            new_doc["profile_pic_real"] = file_path
        db.users.update_one({'username': payload['id']}, {'$set':new_doc})
        return jsonify({"result": "success", 'msg': '프로필을 업데이트했습니다.'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/get_posts", methods=['GET'])
def get_posts():

    posts = list(db.page.find({}).sort("time", -1))

    for post in posts:
        post["_id"] = str(post["_id"])

    return jsonify({"get_posts":posts})


@app.route('/write', methods=['GET']) # 게시글 작성
def write():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template('write.html', user_info=user_info)

    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="먼저 로그인 해 주시기 바랍니다"))


@app.route('/page', methods=['POST']) # 게시글 작성
def save_page():
        token_receive = request.cookies.get('mytoken')
        try:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            # 포스팅하기
            user_info = db.users.find_one({"username": payload["id"]})
            title_receive = request.form['title_give']
            comment_receive = request.form['comment_give']
            finger_receive = request.form['finger_give']
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
                "username": user_info["profile_name"],
                'title': title_receive,
                'comment': comment_receive,
                'finger': finger_receive,
                'file': f'{filename}.{extension}',
                'genre': genre_receive,
                'time': savetime
            }
            db.page.insert_one(doc)

            return jsonify({"result": "success", 'msg': '포스팅 성공'})
        except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
            return redirect(url_for("home"))

@app.route("/view/<title>")
def view_page(title):
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})

        reviews = list(db.page.find({'title':title}, {"_id": False}))

        return render_template('view.html', user_info=user_info,word=title,reviews=reviews)

    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="먼저 로그인 해 주시기 바랍니다"))

@app.route("/view", methods=["POST"])
def view_post():
    view_receive = request.form['view_give']

    view_list = list(db.view.find({}, {'_id': False}))
    count = len(view_list) + 1

    doc = {
        'num': count,
        'view': view_receive,
        'done': 0
    }

    db.view.insert_one(doc)

    return jsonify({'msg': '등록완료'})


@app.route("/view/done", methods=["POST"])
def view_done():
    num_receive = request.form["num_give"]
    db.view.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    return jsonify({'msg': '작성 완료'})


@app.route("/view", methods=["GET"])
def view_get():
    view_list = list(db.view.find({}, {'_id': False}))
    return jsonify({'view': view_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
