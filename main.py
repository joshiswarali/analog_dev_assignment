from gevent import monkey
monkey.patch_all()
from flask import Flask, request
from pymongo import MongoClient
from pymongo import UpdateOne
from bson import json_util
import json
import grequests
import datetime

app = Flask(__name__)

    
@app.route("/getuser/<uname>")
def get_repos_for_a_user(uname):
    db = connect_to_gitapp_db()

    res = db['users'].find_one({"uname": uname})

    if res == None:
        return {'status': 'ERROR'}
    return json.loads(json_util.dumps(res))


def connect_to_gitapp_db():
    client = MongoClient("mongodb+srv://swaralia:mongo123@cluster0.tvekvig.mongodb.net/?retryWrites=true&w=majority")
    db = client.gitapp  
    return db

'''
This method takes a list of usernames and returns public repos for each of them
'''
@app.route("/getpublicrepos", methods = ["POST"])
def fetch_repos_from_github():

    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.get_json()
    else:
        return 'Content-Type not supported!'

    unames = json['unames']
    urls = [] 

    for u in unames:
        url = "https://api.github.com/users/" + u  + "/repos"
        urls.append(url)

    #make asynchronous request for each username
    responses = (grequests.get(u) for u in urls)
    responses = grequests.map(responses)  

    print(responses)

    resp = []
    bulkUpdates = []

    for i in range(len(responses)):

        #insert into database only if repos found for a particular user
        status = 'NO_PUBLIC_REPOS'
        if isinstance(responses[i].json(), list):
            bulkUpdates.append(
                UpdateOne({"uname": unames[i]}, {'$set': {'repos' : responses[i].json(), "last_modified": datetime.datetime.utcnow()}}, upsert = True))
            status = 'SUCCESS'
        resp.append({'uname': unames[i], 'status': status})

    db = connect_to_gitapp_db()
    db['users'].bulk_write(bulkUpdates)

    return resp


if __name__ == "__main__":
    app.run(debug=True)