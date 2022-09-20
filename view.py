from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient("mongodb+srv://test:sparta@cluster0.pt1uc1c.mongodb.net/?retryWrites=true&w=majority",
                     tlsCAFile=ca)
db = client.dbsparta


@app.route('/')
def home():
    return render_template('index.html')


@app.route("/project01", methods=["POST"])
def project01_post():
    project01_receive = request.form['project01_give']

    project01_list = list(db.project01.find({}, {'_id': False}))
    count = len(project01_list) + 1

    doc = {
        'num': count,
        'project01': project01_receive,
        'done': 0
    }

    db.project01.insert_one(doc)

    return jsonify({'msg': '등록하기'})


@app.route("/project01/done", methods=["POST"])
def project01_done():
    num_receive = request.form["num_give"]
    db.project01.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    return jsonify({'msg': '작성 완료'})


@app.route("/project01", methods=["GET"])
def project01_get():
    project01_list = list(db.project01.find({}, {'_id': False}))
    return jsonify({'projects01': project01_list})





if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
