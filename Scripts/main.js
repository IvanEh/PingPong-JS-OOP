window.onload = function() {
	var game = new Phaser.Game(500, 400, Phaser.AUTO,  'gravi-pong');
	game.state.add("Preload", Preload);
	game.state.add("MainMenu", MainMenu)
	game.state.add("SinglePlayer", SinglePlayer)

	game.state.start("Preload");
}