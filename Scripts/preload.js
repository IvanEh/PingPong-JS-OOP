function Preload () {
	
}

Preload.prototype.preload = function() {
	
};

Preload.prototype.create = function() {
	this.state.start('MainMenu');
	this.stage.disableVisibilityChange = true;
};