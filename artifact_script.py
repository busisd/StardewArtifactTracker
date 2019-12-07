import xml.etree.ElementTree as ET
import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

target_file = None
def list_artifacts(filename):
	if filename != target_file:
		return
	print()
	tree = ET.parse(filename)
	root = tree.getroot()
	print("Artifact locations for "+makeDate(root))
	locations = root.find("locations")
	for loc in list(locations):
		objs = loc.find("objects")
		if objs:
			for item in list(objs):
				if (item.find("value").find("Object").find("name").text.lower() == "artifact spot"):
					print(loc.find("name").text+": ("+item.find("key")[0][0].text+", "+item.find("key")[0][1].text+")")

def makeDate(root):
	year = root.find("year").text
	season = root.find("currentSeason").text
	season = season[0].upper() + season[1:]
	day = root.find("dayOfMonth").text
	return season+" "+day+", Year "+year

def track_file():
	logging.basicConfig(level=logging.INFO,
						format='%(asctime)s - %(message)s',
						datefmt='%Y-%m-%d %H:%M:%S')
	path = "./"
	event_handler = FileSystemEventHandler()
	event_handler.on_modified = lambda event : list_artifacts(event.src_path.split("/")[-1])
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

def main():
	global target_file
	if len(sys.argv) != 2:
		print("Please type python3 artifact_script.py [name_of_save_file]")
	target_file = sys.argv[1]
	track_file()
	return

if __name__ == "__main__":
	main()

