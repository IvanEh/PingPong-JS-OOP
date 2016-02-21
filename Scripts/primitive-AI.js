function PrimitiveAI(game, board, ball){
	this.game = game;
	this.board = board;
	this.ball = ball;

	this.board.AI = this; // cross reference;
	this.board.update = this.update;
}

PrimitiveAI.prototype.update = function() {
	var ball = this.AI.ball;
	var delta = 30;
	if(ball.x > this.x + delta)
		this.body.acceleration.x = Settings.player.acceleration.x;
	else
	if(ball.x < this.x - delta)
		this.body.acceleration.x = -Settings.player.acceleration.x;
	else
		this.body.acceleration.x = 0;
};



