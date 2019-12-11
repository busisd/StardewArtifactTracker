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
	
	makeImgDiv() {
		var this_img_div = document.createElement("div");
		this_img_div.id = this.name
		this_img_div.className = "map"
		
		var this_img = document.createElement("img");
		this_img.src = this.img_src;
		
		this_img_div.appendChild(this_img);
		
		return this_img_div;
	}
	
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
	
	addSelfTo(node) {
		node.appendChild(this.wrapper_div);
	}
	
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
	}
	
	removeSpots() {
		while (this.img_div.children.length > 1) {
			this.img_div.removeChild(this.img_div.children[1]);
		}
		
		this.spot_count = 0;
	}
	
	addTag(x, y, item_name) {
		let new_span = document.createElement("span");
		let x_str = x.toString();
		let y_str = y.toString();
		new_span.innerText = item_name+" at ("+x_str+", "+y_str+")";		
		this.wrapper_div.appendChild(new_span);
		this.wrapper_div.appendChild(document.createElement("br"));
	}
	
	addSpotAndTag(data_row) {
		this.addSpot(data_row[1], data_row[2], data_row[3]);
		this.addTag(data_row[1], data_row[2], data_row[3]);
	}
	
	removeTags() {
		while (this.wrapper_div.children.length > 2) {
			this.wrapper_div.removeChild(this.wrapper_div.children[2]);
		}
	}
	
	updateArtifactNumSpan(){
		if (this.spot_count === 1) {
			this.artifacts_num_span.innerText = this.spot_count.toString()+" artifact spot";
		} else {
			this.artifacts_num_span.innerText = this.spot_count.toString()+" artifact spots";
		}
	}
	
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

function removeAllSpotsAndTags() {
	all_maps = Object.entries(maps_dict);
	for (let i=0; i<all_maps.length; i++) {
		all_maps[i][1].removeSpots();
		all_maps[i][1].removeTags();
	}
}

function populateArtifactSpots(data) {
	removeAllSpotsAndTags();
	for (let i=0; i<data.length; i++){
		maps_dict[data[i][0]].addSpotAndTag(data[i]);
	}
}

function updateAllNumSpans() {
	all_maps = Object.entries(maps_dict);
	for (map_row of all_maps) {
		map_row[1].updateArtifactNumSpan();
	}
}

var prev_date = null;
var most_recent_result = null;
function pingServerAndUpdate() {
	$.getJSON("http://127.0.0.1:5000/", function(result){
		// console.log(result);
		if (prev_date !== result["date"]){
			populateArtifactSpots(result["content"]);
			prev_date = result["date"];
			most_recent_result = result;
						
			updateAllNumSpans();
			
			checkTrackedItemMatches();
			updateTrackedItemUl();
		}
	});
}

pingServerAndUpdate();
var update_interval = setInterval(pingServerAndUpdate, 5000);
update_button = document.getElementById("update_button");
$(update_button).click(function(){
	if (update_interval !== null) {
		clearInterval(update_interval);
		update_interval = null;
		update_button.innerText = "Start Auto Reload";
	} else {
		update_interval = setInterval(pingServerAndUpdate, 5000);
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
}

var matching_item_list = [];
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

function dataRowToString(row) {
	return row[0].toString()+" "+"("+row[1].toString()+", "+row[2].toString()+"): "+row[3].toString();
}

var tracked_items_header = document.getElementById("tracked_results_header");
var tracked_items_ul = document.getElementById("tracked_results_list");
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
			tracked_items_ul.appendChild(new_li);
		}
	}
}

$("#tracked_input").focusout(function() { 
	updateTrackedItemList();
	checkTrackedItemMatches();
	updateTrackedItemUl();
});
