/**
 * Author: Daniel Busis
 * A website that displays Stardew Valley artifact spots: their locations and 
 * what they contain. Auto-updates with each passing day.
 */
 
/**
 * A class that represents a map of a single zone of Stardew Valley.
 * Keeps track of the relevant img div of the map, as well as various
 * other information such as the number of artifacts on that map at 
 * a given time.
 */
class ValleyMap {
	constructor(name, img_src, width, height){
		this.name = name
		this.img_src = img_src;
		this.width = width;
		this.height = height;
		this.img_div = this.makeImgDiv();
		this.artifacts_num_span = null;
		this.wrapper_div = this.makeWrapperDiv();
		this.spot_width = 1/width;
		this.spot_height = 1/height;
		
		this.spot_count = 0;
	}
	
	/**
	 * Creates the div and img html elements for the map.
	 */
	makeImgDiv() {
		var this_img_div = document.createElement("div");
		this_img_div.id = this.name
		this_img_div.className = "map"
		
		var this_img = document.createElement("img");
		this_img.src = this.img_src;
		
		this_img_div.appendChild(this_img);
		
		return this_img_div;
	}
	
	/**
	 * Creates the div that wraps the img and other information
	 * associated with this map.
	 */
	makeWrapperDiv() {
		var wrapper_div = document.createElement("div");
		wrapper_div.className="wrapper";
		wrapper_div.id=this.name+"_wrapper";
		
		var title_span = document.createElement("h2");
		title_span.innerText = this.name+": ";
		wrapper_div.appendChild(title_span);
		
		this.artifacts_num_span = document.createElement("span");
		title_span.appendChild(this.artifacts_num_span);
		
		wrapper_div.appendChild(this.img_div);
		
		return wrapper_div;
	}
	
	/**
	 * Used to add the wrapper div to the document.
	 */
	addSelfTo(node) {
		node.appendChild(this.wrapper_div);
	}

	/**
	 * Adds a div representing an artifact spot as a child of the map img element. 
	 * Tags that spot with the name of the artifact within.
	 */
	addSpot(x, y, item_name) {
		var hori_center = x*this.spot_width + this.spot_width/2
		var vert_center = y*this.spot_height + this.spot_height/2
		
		var new_spot = document.createElement("div");
		new_spot.className = "artifact_spot";
		new_spot.zIndex=1;
		
		new_spot.style.left = ValleyMap.doubleToPercent(hori_center-this.spot_width/2)
		new_spot.style.right = ValleyMap.doubleToPercent(1 - (hori_center+this.spot_width/2))
		new_spot.style.top = ValleyMap.doubleToPercent(vert_center-this.spot_height/2)
		new_spot.style.bottom = ValleyMap.doubleToPercent(1 - (vert_center+this.spot_height/2))
		
		this.img_div.appendChild(new_spot);
		
		let new_hover = document.createElement("span");
		new_hover.className = "artifact_spot_hover";
		new_hover.innerText = item_name;
		new_spot.appendChild(new_hover);
		
		new_spot.onmouseover = function() {
			// new_hover.style.visibility = "visible"	
			new_hover.classList.remove("fadeout");
			new_hover.classList.add("fadein");
		}
		new_spot.onmouseout = function() {
			// new_hover.style.visibility = "hidden"			
			new_hover.classList.remove("fadein");
			new_hover.classList.add("fadeout");
		}
		
		this.spot_count += 1;
		
		return new_spot;
	}
	
	/**
	 * Removes all spots generated by addSpot()
	 */
	removeSpots() {
		while (this.img_div.children.length > 1) {
			this.img_div.removeChild(this.img_div.children[1]);
		}
		
		this.spot_count = 0;
	}
	
	/**
	 * Adds a line below the img element that lists out a single artifact and its location.
	 */
	addTag(x, y, item_name) {
		let new_span = document.createElement("span");
		let x_str = x.toString();
		let y_str = y.toString();
		new_span.innerText = item_name+" at ("+x_str+", "+y_str+")";		
		this.wrapper_div.appendChild(new_span);
		this.wrapper_div.appendChild(document.createElement("br"));
		
		return new_span;
	}
	
	/**
	 * Calls addSpot and addTag to add a new artifact to this ValleyMap. Then, 
	 * gives the new tag the onmouseover behavior of the new spot; this is to make
	 * it so that when the tag is moused over, its corresponding spot displays what
	 * it contains.
	 */
	addSpotAndTag(data_row) {
		let new_spot = this.addSpot(data_row[1], data_row[2], data_row[3]);
		let new_tag = this.addTag(data_row[1], data_row[2], data_row[3]);
		
		new_tag.onmouseover = new_spot.onmouseover;
		new_tag.onmouseout = new_spot.onmouseout;
	}
	
	/**
	 * Removes all tags below the img element.
	 */
	removeTags() {
		while (this.wrapper_div.children.length > 2) {
			this.wrapper_div.removeChild(this.wrapper_div.children[2]);
		}
	}
	
	/**
	 * Updates the title of the wrapper to display the correct number of artifacts within the map.
	 */
	updateArtifactNumSpan(){
		if (this.spot_count === 1) {
			this.artifacts_num_span.innerText = this.spot_count.toString()+" artifact spot";
		} else {
			this.artifacts_num_span.innerText = this.spot_count.toString()+" artifact spots";
		}
	}

	/**
	 * Updates the navigation link at the top of the page associated with this map
	 * to display the number of artifact spots in this location.
	 */
	updateNavLinkNumSpan(){
		navs_dict[this.name].firstElementChild.innerText=" ("+this.spot_count.toString()+")";
	}
	
	/**
	 * Turns a double into a percentage string (i.e. 0.46 becomes "46%")
	 */
	static doubleToPercent(d) {
		return (d*100).toString()+"%"
	}
}

// var test_map = new ValleyMap("test", "maps/test_map.bmp", 60, 30);
// test_map.addSelfTo(document.body);

var maps_info = [
	["Forest", 120, 120],
	["Farm", 80, 65],
	["Beach", 104, 50],
	["Desert", 50, 60],
	["Town", 120, 110],
	["BusStop", 35, 30],
	["Woods", 60, 32],
	["Mountain", 135, 41],
	["Railroad", 70, 62],
	["Backwoods", 50, 40]
]

maps_dict = {};
for (let i=0; i<maps_info.length; i++){
	cur_row = maps_info[i]
	maps_dict[cur_row[0]] = new ValleyMap(cur_row[0], "maps/"+cur_row[0]+".png", cur_row[1], cur_row[2]);
	maps_dict[cur_row[0]].addSelfTo(document.body);
}

/**
 * Removes all spots and tags from all ValleyMaps
 */
function removeAllSpotsAndTags() {
	all_maps = Object.entries(maps_dict);
	for (let i=0; i<all_maps.length; i++) {
		all_maps[i][1].removeSpots();
		all_maps[i][1].removeTags();
	}
}

/**
 * Given a set of data, populates all ValleyMaps with their appropriate
 * spots and tags.
 * @param {1} data A list of lists that correspond to artifacts. Each list
 * is of the following form: 
 * ["Location", "x_coord", "y_coord", "Artifact spot contents"]
 */
function populateArtifactSpots(data) {
	removeAllSpotsAndTags();
	for (let i=0; i<data.length; i++){
		maps_dict[data[i][0]].addSpotAndTag(data[i]);
	}
}

/**
 * Updates the headers of each ValleyMap wrapper to display the correct
 * number of artifacts
 */
function updateAllNumSpans() {
	all_maps = Object.entries(maps_dict);
	for (map_row of all_maps) {
		map_row[1].updateArtifactNumSpan();
	}
}

/**
 * Updates all navigation links at top of page to display the 
 * correct number of artifacts
 */
function updateAllNavLinkNums() {
	all_maps = Object.entries(maps_dict);
	for (map_row of all_maps) {
		map_row[1].updateNavLinkNumSpan();
	}
}

var prev_date = null;
var most_recent_result = null;
/**
 * This site requires information from a local file (Stardew Valley savefile); however, most browsers
 * don't allow JavaScript to access local files because it is a big security risk. So, the project comes
 * with an extremely simple flask server that allows this site to get a set of useful information about
 * the artifact spots in the Stardew Valley world.
 * 
 * This function gathers the information from that server and, if it has changed, updates all relevant
 * values. Default behavior is to call this function every 2.5 seconds with an interval.
 */
function pingServerAndUpdate() {
	$.getJSON("http://127.0.0.1:5000/", function(result){
		if (prev_date !== result["date"]){
			console.log(result);
			populateArtifactSpots(result["content"]);
			prev_date = result["date"];
			most_recent_result = result;
						
			updateAllNumSpans();
			
			checkTrackedItemMatches();
			updateTrackedItemUl();
			
			updateDateDisplay(result["date"]);
			updateAllNavLinkNums();
		}
	});
}

pingServerAndUpdate();
var update_interval = setInterval(pingServerAndUpdate, 2500);
update_button = document.getElementById("update_button");
$(update_button).click(function(){
	if (update_interval !== null) {
		clearInterval(update_interval);
		update_interval = null;
		update_button.innerText = "Start Auto Reload";
	} else {
		update_interval = setInterval(pingServerAndUpdate, 2500);
		update_button.innerText = "Stop Auto Reload";
	}
});

var wrapper_list = []
for (let i=0; i<maps_info.length; i++) {
	wrapper_list.push($("#"+maps_info[i][0]+"_wrapper")[0]);
}

$("a").each(function(index){
	$(this)[0].onclick = function(e) {
		e.preventDefault();
		window.scrollTo(0,wrapper_list[index].offsetTop-10);
    }
})


var tracked_input = document.getElementById("tracked_input");
var tracked_item_list = [];
/**
 * Updates the list of phrases to match to specific items the user
 * might be hunting.
 */
function updateTrackedItemList(){
	let items_string = tracked_input.value;
	tracked_item_list = items_string.split("\n");
	
	let index = tracked_item_list.indexOf("");
	while (index !== -1){
		tracked_item_list.splice(index, 1);
		index = tracked_item_list.indexOf("");
	}
	
	for (let i=0; i<tracked_item_list.length; i++) {
		tracked_item_list[i] = tracked_item_list[i].trim().toLowerCase();
	}
	
	localStorage.tracked_artifacts_input = tracked_input.value;
}

var matching_item_list = [];
/**
 * Matches user-tracked phrases against the currently known list of artifacts in the world.
 */
function checkTrackedItemMatches(){
	matching_item_list = [];
	if (most_recent_result === null || most_recent_result["content"].length === 0 || tracked_item_list.length === 0) {
		return
	}
	
	foundIndices = [];
	for (let i=0; i<tracked_item_list.length; i++) {
		for (let j=0; j<most_recent_result["content"].length; j++) {
			let cur_content_item = most_recent_result["content"][j][3].trim().toLowerCase();
			if (cur_content_item.includes(tracked_item_list[i]) && foundIndices.indexOf(j) === -1) {
				matching_item_list.push(most_recent_result["content"][j]);
				foundIndices.push(j);
				continue;
			}
		}
	}
}

/**
 * Turns a row in the form ["Location", "x_coord", "y_coord", "Artifact spot contents"] into a 
 * nicely-formatted, readable string.
 */
function dataRowToString(row) {
	return row[0].toString()+" "+"("+row[1].toString()+", "+row[2].toString()+"): "+row[3].toString();
}

navs_dict = {
	"Forest" : document.getElementById("Forest_nav"),
	"Farm" : document.getElementById("Farm_nav"),
	"Beach" : document.getElementById("Beach_nav"),
	"Desert" : document.getElementById("Desert_nav"),
	"Town" : document.getElementById("Town_nav"),
	"BusStop" : document.getElementById("BusStop_nav"),
	"Woods" : document.getElementById("Woods_nav"),
	"Mountain" : document.getElementById("Mountain_nav"),
	"Railroad" : document.getElementById("Railroad_nav"),
	"Backwoods" : document.getElementById("Backwoods_nav")
}

var tracked_items_header = document.getElementById("tracked_results_header");
var tracked_items_ul = document.getElementById("tracked_results_list");
/**
 * Updates the list of found matches between user-tracked phrases and artifacts currently in the 
 * ValleyMaps
 */
function updateTrackedItemUl(){
	while (tracked_items_ul.lastChild) {
		tracked_items_ul.removeChild(tracked_items_ul.lastChild);
	}
	
	if (matching_item_list.length === 0) {
		tracked_items_ul.style.display = "none";
		tracked_items_header.innerText = "No matches found";
	} else {
		tracked_items_ul.style.display = "inherit";
		if (matching_item_list.length === 1) {
			tracked_items_header.innerText = "1 match found:";
		} else {
			tracked_items_header.innerText = matching_item_list.length.toString()+" matches found:";
		}
		
		for (match_row of matching_item_list) {
			let new_li = document.createElement("li");
			new_li.innerText = dataRowToString(match_row);
			new_li.onclick = navs_dict[match_row[0]].parentElement.onclick;
			tracked_items_ul.appendChild(new_li);
		}
	}
}

$("#tracked_input").focusout(function() { 
	updateTrackedItemList();
	checkTrackedItemMatches();
	updateTrackedItemUl();
});

var date_display = document.getElementById("date_display");
/**
 * Updates the display to correctly display the current Stardew date.
 */
function updateDateDisplay(date) {
	date_display.innerText = date;
}

if (localStorage.tracked_artifacts_input) {
	tracked_input.value = localStorage.tracked_artifacts_input;
	updateTrackedItemList();
	checkTrackedItemMatches();
	updateTrackedItemUl();
}
