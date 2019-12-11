import xml.etree.ElementTree as ET
import sys
import os
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from watchdog.events import FileModifiedEvent
import math
import json

try:
	import csrandom
except ModuleNotFoundError:
	print(
'''Error: you must download csrandom.py from :
https://gist.github.com/badstreff/541cf2e6953b3c666f83127a1d4f6a47
and place it in this folder!''', file=sys.stderr)
	exit()

try:
	import object_data
	import location_data
except ModuleNotFoundError:
	print(
'''Error: you must create files object_data.py and location_data.py
and place them in this folder. See README for how to do so.''', file=sys.stderr)
	exit()

if (len(object_data.data) < 2 or len(location_data.data) < 2):
		print(
'''Error: you must populate the object_data.py and location_data.py
files with the .xnb file data. See README for how to do so.''', file=sys.stderr)



def write_json_to_file(json_obj, json_filename="data.json"):
	full_filename = os.path.join(sys.path[0], json_filename)
	with open(full_filename, "w") as json_file:
		json_file.write(json.dumps(json_obj))
		json_file.flush()

target_file = None
def list_artifacts(filename, printout = True):
	'''
		Given a filename, will list each artifact spot in that file,
		where those spots are, and what artifacts are in them
	'''
	tree = ET.parse(target_file)
	root = tree.getroot()
	
	cur_date = make_date(root)
	final_json = {}
	final_json["date"] = cur_date	
	final_json["content"] = []
	
	if printout:
		print()
		print("Artifact locations for "+cur_date)
	locations = root.find("locations")
	for loc in list(locations):
		objs = loc.find("objects")
		if objs:
			for item in list(objs):
				if (item.find("value").find("Object").find("name").text.lower() == "artifact spot"):
					loc_name = loc.find("name").text
					item_x = item.find("key")[0][0].text
					item_y = item.find("key")[0][1].text
					item_name = predict_item(root, item, loc_name)
					if printout:
						print(loc_name+": ("+item_x+", "+item_y+") is "+item_name)
					
					#[loc, x, y, item]
					new_row = [loc_name, item_x, item_y, item_name]
					final_json["content"].append(new_row)
	
	write_json_to_file(final_json)

def make_date(root):
	'''
		Given the root of an XML tree corresponding to the savefile,
		will display the date of that file in a nice format
	'''
	year = root.find("year").text
	season = root.find("currentSeason").text
	season = season[0].upper() + season[1:]
	day = root.find("dayOfMonth").text
	return season+" "+day+", Year "+year

def predict_item(root, item, loc_name):
	'''
		Simulates the Stardew Valley logic and random number generation used 
		to generate artifacts, in order to predict what will be generated
	'''
	
	days_played = int(root.find("player").find("stats").find("daysPlayed").text)
	uid = int(root.find("uniqueIDForThisGame").text)
	lost_books_found = int(root.find("lostBooksFound").text)
	item_x = int(item.find("key")[0][0].text)
	item_y = int(item.find("key")[0][1].text)
	season = root.find("currentSeason").text
	
	random = csrandom.Random(item_x * 2000 + item_y + math.floor(uid / 2) + math.floor(days_played))
	game1_random = csrandom.Random(1) #used for secret notes, no way to simulate this
	objectIndex = -1
	for key in object_data.data.keys():
		if obj_is_arch(key):
			locations_array = object_data.data[key].split("/")[6].split(" ")
			for i in range(0, len(locations_array), 2):
				if (locations_array[i] == loc_name and random.Sample() < float(locations_array[i+1])):
					objectIndex = int(key)
					break
		if objectIndex != -1:
			break
	if (random.Sample() < .2 and loc_name != "Farm"):
		objectIndex = 102 #Lost book
	if (objectIndex == 102 and lost_books_found >= 21):
		objectIndex = 770 #Mixed seeds
	if objectIndex != -1:
		return get_obj_by_index(objectIndex)
	elif (season == "winter" and random.Sample() < .5 and loc_name != "Desert"):
		if random.Sample() < 0.4:
			return get_obj_by_index(416) #snow yam
		else:
			return get_obj_by_index(412) #winter root
	elif (season == "spring" and random.Sample() < (1.0 / 16.0) and (loc_name != "desert" and loc_name != "beach")):
		return str(random.Next(2,6))+" "+get_obj_by_index(273) #rice shoot
	else:
		loc_weights = location_data.data[loc_name].split("/")[8].split(" ")
		for i in range(0, len(loc_weights), 2):
			if random.Sample() <= float(loc_weights[i+1]):
				str_index = loc_weights[i]
				if (obj_is_arch(str_index) or str_index == "102"):
					if (objectIndex == 102 and lost_books_found >= 21):
						objectIndex = 770 #Mixed seeds
					return get_obj_by_index(int(str_index))
				# if (str_index == "330" and True and game1_random.Sample() < .11):
					# return "Secret note"
				if str_index == "330":
					return str(random.Next(1,4))+" "+"Clay or Secret Note"
				return str(random.Next(1,4))+" "+get_obj_by_index(int(str_index))

def get_obj_by_index(index):
	'''
		Returns the name of the object in object_data.data with the given index
	'''
	return object_data.data[str(index)].split("/")[0]
	
def obj_is_arch(str_index):
	'''
		Returns whether the item is classified as an archeology item
	'''
	return "Arch" in object_data.data[str_index].split("/")[3]



def handle_file_modified(event, printout=True):
	'''
		If the event is a FileModifiedEvent and it is about the 
		target file, calls list_artifacts on the modified file
	'''
	filename = event.src_path
	if type(event) != FileModifiedEvent:
		return
	if (os.path.split(target_file)[-1] != os.path.split(filename)[-1]):
		return
	list_artifacts(event.src_path, printout)
	
def track_file(path, printout=True):
	'''
		Sets up a watchdog Observer that calles handle_file_modified whenever
		a file in the given path is modified.
	'''
	logging.basicConfig(level=logging.INFO,
						format='%(asctime)s - %(message)s',
						datefmt='%Y-%m-%d %H:%M:%S')
	event_handler = FileSystemEventHandler()
	event_handler.on_modified = lambda event : handle_file_modified(event, printout)
	observer = Observer()
	observer.schedule(event_handler, path, recursive=False)
	observer.start()
	try:
		while True:
			time.sleep(1000)
	except KeyboardInterrupt:
		observer.stop()
	observer.join()
	print()

def start_tracking(filename, printout=True):	
	global target_file
	target_file = filename
	if not os.path.isfile(target_file):
		print("Error: "+target_file+" is not a valid file", file=sys.stderr)
		return
	
	list_artifacts(target_file, printout)
	path = os.path.dirname(target_file)
	if path == "":
		path = "./"
	track_file(path, printout)
	return

def main():
	if len(sys.argv) != 2:
		print("Correct usage: python3 artifact_script.py [path/to/savefile]", file=sys.stderr)
		return
	
	start_tracking(sys.argv[1])

if __name__ == "__main__":
	main()

