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
	["Mountain", 135, 41]
]

maps_dict = {};
for (var i = 0; i<maps_info.length; i++){
	cur_row = maps_info[i]
	maps_dict[cur_row[0]] = new ValleyMap(cur_row[0], "maps/"+cur_row[0]+".png", cur_row[1], cur_row[2]);
	maps_dict[cur_row[0]].addSelfTo(document.body);
}










