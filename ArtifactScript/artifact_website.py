from flask import Flask, render_template
# from flask_socketio import SocketIO
import sys
import os
# import artifact_script

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app)

#makes only errors be logged to command line
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@app.after_request
def set_headers(response):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers["Access-Control-Allow-Methods"]=["GET","POST","PUT","DELETE","OPTIONS"]
	response.headers["Access-Control-Allow-Headers"]="Content-Type"

	return response


@app.route('/')
def main_page():
	full_filename = os.path.join(sys.path[0], "data.json")
	with open(full_filename, "r") as json_file:
		return json_file.read()

if __name__ == '__main__':
    # socketio.run(app)
    app.run()
