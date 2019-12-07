import xml.etree.ElementTree as ET

tree = ET.parse('./testchar1_235364326')
root = tree.getroot()
locations = root.find("locations")
beach = list(locations)[14]
print(list(locations)[14].find("name").text)
beach_obj = beach.find("objects")
list(beach_obj)[1].find("value").find("Object").find("name").text #artifact spot!

list(list(beach_obj)[1].find("key"))[0][0].text # x-coord
list(list(beach_obj)[1].find("key"))[0][1].text # y-coord



for loc in list(locations):
	objs = loc.find("objects")
	if objs:
		for item in list(objs):
			if (item.find("value").find("Object").find("name").text.lower() == "artifact spot"):
				print(loc.find("name").text+": ("+item.find("key")[0][0].text+", "+item.find("key")[0][1].text+")")
				
# for child in tree.getroot():
	# print(child.tag, child.attrib)

# for child in tree.getroot().iter():
	# if(child.tag == 'willDestroyObjectsUnderfoot'):
		# print(child.tag, child.attrib)

# list(locations)[0].find("name").text
