# StardewArtifactTracker
A script that, at the start of each new Stardew day, will automatically print out a list of artifact spot locations and 
what items are in those spots. Will also print the artifacts of the current day when first run.

To run, place the ArtifactScript folder into the folder with your savefile in it. For example:
```
C:\Users\<user>\AppData\Roaming\StardewValley\Saves\<character_1234567890>
```

To make the program run, a few changes must be made (in order to protect the code/privacy of others). First, the files location_data-empty.py and object_data-empty.py should be renamed to location_data.py and object_data.py, and their contents should be filled in with the contents of their corresponding .xnb files, ObjectInformation.xnb and Locations.xnb. A tutorial for how to do this is located within the two -empty versions of the files.

Additionally, to simulate the random number generation of Stardew Valley (written in C#), you should download the file csrandom.py from https://gist.github.com/badstreff/541cf2e6953b3c666f83127a1d4f6a47 and place it in the folder.

Finally, to run the script, cd into its folder and type the following:
```
python3 artifact_script.py ../character_1234567890
```
(where character_1234567890 is replaced by the name of the corresponding file in your folder).

