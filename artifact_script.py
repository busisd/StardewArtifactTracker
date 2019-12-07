import xml.etree.ElementTree as ET

tree = ET.parse('./testchar1_235364326')
root = tree.getroot()
locations = root.find("locations")
for loc in list(locations):
	objs = loc.find("objects")
	if objs:
		for item in list(objs):
			if (item.find("value").find("Object").find("name").text.lower() == "artifact spot"):
				print(loc.find("name").text+": ("+item.find("key")[0][0].text+", "+item.find("key")[0][1].text+")")
				
