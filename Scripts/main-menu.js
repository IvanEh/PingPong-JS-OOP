function MainMenu () {
	this.buttons = {};
	this.labels = {};
}

MainMenu.prototype.preload = function() {
	
};

MainMenu.prototype.create = function() {
	this.game.stage.backgroundColor = "#001494";
	this.buttons.singlePlay = new Button("New Game", "center", 30, 150, 45, this, "rgb(128, 192, 196)", onSinglePlay);
};

MainMenu.prototype.update = function() {
	
};

function onSinglePlay () {
	console.log(1);
	this.sprite.game.state.start("SinglePlayer", SinglePlayer);
}