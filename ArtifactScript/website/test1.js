class ValleyMap {
	constructor(name, img_src, width, height){
		this.name = name
		this.img_src = img_src;
		this.width = width;
		this.height = height;
		this.img_div = this.makeImgDiv();
		this.spot_width = 1/width;
		this.spot_height = 1/height;
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
	
	addSelfTo(node) {
		node.appendChild(this.img_div);
	}
	
	addSpot(x, y) {
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
	}
	
	removeSpots() {
		while (this.img_div.children.length > 1) {
			this.img_div.removeChild(this.img_div.children[1]);
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
	["Railroad", 70, 62]
]

maps_dict = {};
for (let i=0; i<maps_info.length; i++){
	cur_row = maps_info[i]
	maps_dict[cur_row[0]] = new ValleyMap(cur_row[0], "maps/"+cur_row[0]+".png", cur_row[1], cur_row[2]);
	maps_dict[cur_row[0]].addSelfTo(document.body);
}

function remove_all_spots() {
	all_maps = Object.entries(maps_dict);
	for (let i=0; i<all_maps.length; i++) {
		all_maps[i][1].removeSpots();
	}

}

var test_data = [["Farm", "74", "13", "2 Clay or Secret Note"], ["Farm", "28", "38", "2 Clay or Secret Note"], ["Farm", "16", "49", "Winter Root"], ["Farm", "15", "30", "1 Stone"], ["Town", "16", "63", "2 Clay or Secret Note"], ["Town", "87", "103", "Lost Book"], ["Town", "79", "16", "Winter Root"], ["Beach", "42", "21", "Lost Book"], ["Beach", "36", "21", "2 Clay or Secret Note"], ["Mountain", "41", "30", "1 Clay or Secret Note"], ["Mountain", "45", "19", "1 Clay or Secret Note"], ["Forest", "74", "44", "Winter Root"], ["Forest", "79", "68", "2 Clay or Secret Note"], ["Forest", "89", "25", "2 Clay or Secret Note"], ["Forest", "37", "90", "Lost Book"], ["Forest", "75", "10", "Ancient Sword"], ["BusStop", "16", "23", "Winter Root"], ["BusStop", "21", "11", "Prehistoric Handaxe"], ["BusStop", "27", "11", "Winter Root"], ["BusStop", "8", "12", "3 Clay or Secret Note"], ["BusStop", "10", "4", "3 Clay or Secret Note"], ["BusStop", "2", "24", "Winter Root"], ["Desert", "21", "35", "Golden Relic"], ["Desert", "15", "37", "2 Clay or Secret Note"], ["Desert", "30", "46", "2 Clay or Secret Note"], ["Desert", "4", "54", "Lost Book"], ["Desert", "14", "43", "3 Clay or Secret Note"], ["Woods", "45", "10", "Lost Book"], ["Woods", "41", "16", "Snow Yam"], ["Woods", "25", "13", "2 Clay or Secret Note"], ["Woods", "23", "17", "Lost Book"], ["Railroad", "47", "56", "Winter Root"]]

function populate_artifact_spots(data) {
	remove_all_spots();
	for (let i=0; i<test_data.length; i++){
		maps_dict[data[i][0]].addSpot(data[i][1], data[i][2]);
	}
}

populate_artifact_spots(test_data);


