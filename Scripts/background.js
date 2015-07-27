function TriangBackground (state) {
	this.gameState = state;
	this.sprite = this.gameState.add.sprite(0, 0, this.bitmap);
	this.color = "blue";
	this.hcount = 3;
	this.vcount = 3;
	this.size = {normal: 0.5, max: 0.7, min: 0.3};
	this.currentSize = 0; 
	this.grid = [];
	this.tiles = this.gameState.add.group();

	for(var i = this.vcount; i >= 0; i--){
		this.grid.push([]);	
	}

	for(var i = this.vcount; i > 0; i--){
		for(var j = this.hcount; j > 0; j--){
			var tile = this.tile(i, j);
			this.tiles.add(tile);
			this.grid[i][j] = tile;
		}
	}
}

TriangBackground.prototype.tileWidth = function(){
	return Math.floor((this.gameState.game.width / this.hcount)*this.size.normal);
}

TriangBackground.prototype.tileHeight = function(){
	return Math.floor((this.gameState.game.height / this.vcount)*this.size.normal);
}

TriangBackground.prototype.leftPoint = function(){
	var y = Math.floor(Math.random()*this.tileHeight());
	return {x: 0, y:y} ;
}

TriangBackground.prototype.rightPoint = function(){
	var y = Math.floor(Math.random()*this.tileHeight()); 
	return {x: this.tileWidth(), y: y};
}

TriangBackground.prototype.topPoint = function(){
	var x = Math.floor(Math.random()*this.tileWidth()); 
	return {x: x, y:0} ;
}

TriangBackground.prototype.bottomPoint = function(){
	var x = Math.floor(Math.random()*this.tileWidth()); 
	return {x: x, y:this.tileHeight()} ;
}

TriangBackground.prototype.genTriang = function(){
	var usedPoints = [false, false, false, false];
	var points = [];
	
	while(points.length < 3){
		var choose = Math.floor(Math.random()*4);
		if(!usedPoints[choose]){
			usedPoints[choose] = true;
			switch(choose){
				case 0:
					points.push(this.leftPoint());
					break;
				case 1:
					points.push(this.rightPoint());
					break;
				case 2:
					points.push(this.topPoint());
					break;
				case 3:
					points.push(this.bottomPoint());
					break;
			}
		}
	}

	return points;
}

TriangBackground.prototype.tile = function(i, j){
	var points = this.genTriang();
	var texture = this.gameState.make.bitmapData(this.tileWidth(), this.tileHeight());
	var ctx = texture.context;
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	ctx.lineTo(points[1].x, points[1].y);
	ctx.lineTo(points[2].x, points[2].y);
	ctx.lineTo(points[0].x, points[0].y);
	ctx.stroke();

	var hsize = this.gameState.game.width / this.hcount;
	var dmove = 0;
	var x = hsize*(j-1);
		dmove =  hsize - this.tileWidth();
		dmove /= 1.42;
		x = x + Math.floor(Math.random()*dmove);

	var vsize = this.gameState.game.height / this.vcount;
	var y = vsize*(i-1);
		dmove =  vsize - this.tileHeight();
		dmove /= 1.42;

		y = y + Math.floor(Math.random()*dmove);


	var sprite = this.gameState.add.sprite(x, y, texture);
	return sprite;
}