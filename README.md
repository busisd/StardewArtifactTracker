# StardewArtifactTracker
A tool for displaying Stardew Valley artifact spots and their contents in order to find annoyingly rare items! 

A website display that shows which artifacts are on the map, and where, updating every day. Allows tracking specified terms to find specific artifacts.

![Screenshot of Site](https://raw.githubusercontent.com/busisd/StardewArtifactTracker/master/ArtifactScript/website_resources/Website_Example_Screenshot.png)

Can also be used solely as a command-line program that outputs the names and locations of all found items each day.

To run, place the ArtifactScript folder into the folder with your savefile in it. For example:
```
C:\Users\<user>\AppData\Roaming\StardewValley\Saves\<character_1234567890>
```

To run the website, cd into its folder and type the following:
```
python3 artifact_website.py ../character_1234567890
```
Then open the HTML file ArtifactDisplay.html in your command line.

If you wish to only use the command line program, type:
```
python3 artifact_script.py ../character_1234567890
```

To make the program run, a few changes must be made (in order to protect the code/privacy of others). First, the files location_data-empty.py and object_data-empty.py should be renamed to location_data.py and object_data.py, and their contents should be filled in with the contents of their corresponding .xnb files, ObjectInformation.xnb and Locations.xnb. A tutorial for how to do this is located within the two -empty versions of the files.

Additionally, to simulate the random number generation of Stardew Valley (written in C#), you should download the file csrandom.py from https://gist.github.com/badstreff/541cf2e6953b3c666f83127a1d4f6a47 and place it in the folder.
