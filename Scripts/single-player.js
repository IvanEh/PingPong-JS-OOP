Settings = {
	player: {
		maxVelocity: new Phaser.Point(250, 0),
		acceleration: new Phaser.Point(750, 0)
	},

	ball: {
		velocity: new Phaser.Point(0, 250),
		maxVelocity: new Phaser.Point(500, 400),
	},

	winScore: 1,
	drag: 200,
	padding: 25,
}

function SinglePlayer(){
	 this.enemyBoard;
	 this.playerBoard;
	 this.playerBoardTexture;
	 this.playerPowerScale = 75;
	 this.graviScale = {x: 4, y:3, w:88, h: 6, color: "#1b1464", step: 2};
	 this.ball;
	 this.trigger = {};
	 this.scoreText;
	 this.msg;
	 this.score= {player: 0, enemy: 0};
	 this.cursors;

	 // this.game.stage.smoothed = false;
}

SinglePlayer.prototype.preload = function(){
    this.load.image('board', 'assets/board-blue.png'); 
    this.load.image('ball', 'assets/ball.png');
    this.load.spritesheet('markers', 'assets/markers.png', 9, 9, 3);
}

SinglePlayer.prototype.create = function(){
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.stage.backgroundColor = '#8a8a35';
	this.game.stage.smoothed = false;
    this.markers();

    this.setUpPlayer();

    this.setUpEnemy();

    this.setUpBall();

    this.setUpTriggers();

    this.setUpGUI();

    this.cursors = this.input.keyboard.createCursorKeys();
}


SinglePlayer.prototype.update = function(){
    this.physics.arcade.collide(this.ball, this.playerBoard, this.onCollideBall, null, this);
    this.physics.arcade.collide(this.ball, enemyBoard);
    this.physics.arcade.overlap(this.ball, this.trigger.win, this.onWin,null,  this);
    this.physics.arcade.overlap(this.ball, this.trigger.loose, this.onLoose, null, this);

    this.scoreText.text = this.score.player + " - " + this.score.enemy;

    if(this.cursors.right.isDown){
        this.playerBoard.body.acceleration.setTo(Settings.player.acceleration.x, Settings.player.acceleration.y);
        enemyBoard.body.acceleration.setTo(Settings.player.acceleration.x*1.5, Settings.player.acceleration.y);
    }
    else
    if(this.cursors.left.isDown){
        this.playerBoard.body.acceleration.setTo(-Settings.player.acceleration.x, Settings.player.acceleration.y);
        enemyBoard.body.acceleration.setTo(-Settings.player.acceleration.x*1.5, Settings.player.acceleration.y);
    }
    else
       {
        this.playerBoard.body.acceleration.setTo(0);
        enemyBoard.body.acceleration.setTo(0);
    }

    if(this.cursors.up.isDown && this.playerPowerScale > 0){
        this.ball.body.velocity.add(0, -3);
        if(this.playerPowerScale > 0)
        this.playerPowerScale-=this.graviScale.step;
    }
    else
    if(this.cursors.down.isDown && this.playerPowerScale < 100){
        this.ball.body.velocity.add(0, 3);
        this.playerPowerScale+=this.graviScale.step;
    }
  

    this.updatePlayerTexture();

}

SinglePlayer.prototype.render = function(){
    this.game.debug.body(this.trigger.win);
}


SinglePlayer.prototype.setUpPlayer = function() {
    this.playerBoardTexture = this.make.bitmapData(96, 12);
    this.updatePlayerTexture();

    this.playerBoard = this.add.sprite(this.world.centerX, this.game.height-Settings.padding, this.playerBoardTexture);
    this.playerBoard.anchor.set(0.5);
    this.physics.enable(this.playerBoard, Phaser.Physics.ARCADE);
    this.playerBoard.body.collideWorldBounds = true;
    this.playerBoard.body.drag.set(Settings.drag);
    this.playerBoard.body.maxVelocity.copyFrom(Settings.player.maxVelocity);
    this.playerBoard.body.immovable = true;    
};

SinglePlayer.prototype.setUpEnemy = function() {
    enemyBoard = this.add.sprite(this.world.centerX, Settings.padding, 'board');
    this.physics.enable(enemyBoard, Phaser.Physics.ARCADE);
    enemyBoard.anchor.set(0.5);
    enemyBoard.body.collideWorldBounds = true;
    enemyBoard.body.drag.set(Settings.drag);
    enemyBoard.body.maxVelocity.copyFrom(Settings.player.maxVelocity);
    enemyBoard.body.immovable = true;
};

SinglePlayer.prototype.setUpBall = function() {
    this.ball = this.add.sprite(this.world.centerX, this.world.centerY, 'ball');
    
    this.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);
    
    this.ball.anchor.set(0.5);
    
    var chance = Math.random();
    this.ball.body.velocity.y = Settings.ball.velocity.y;
    if(chance <= 0.5)
        this.ball.body.velocity.y *= -1;
};

SinglePlayer.prototype.setUpTriggers = function(){
    this.trigger.win = this.add.sprite(0, 0, null);
    this.physics.arcade.enable(this.trigger.win);
    this.trigger.win.body.setSize(this.game.width, enemyBoard.top, 0, 0);

    this.trigger.loose = this.add.sprite(0, this.playerBoard.bottom, null);
    this.physics.arcade.enable(this.trigger.loose);
    this.trigger.loose.body.setSize(this.game.width,
         this.game.height - this.playerBoard.bottom, 0, 0);
}

SinglePlayer.prototype.setUpGUI = function() {
    this.scoreText = this.add.text(this.game.width - 60, 8, "0 - 0", {font: "18px Arial"});
    this.msg = this.add.text(this.world.centerX, this.world.centerY, "3");
    this.msg.anchor.set(0.5);
    this.msg.setStyle({fontSize:"21px"});
    this.msg.visible = false;
};

var displayMarkers = [];
SinglePlayer.prototype.markers = function () {
    var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'markers', 0);
    displayMarkers.push(sprite);
    sprite.anchor.set(0.45);

    var sprite = this.add.sprite(0, this.world.centerY, 'markers', 1);
    displayMarkers.push(sprite);
    sprite.anchor.setTo(0, 0.45);

    var sprite = this.add.sprite(this.game.width, this.world.centerY, 'markers', 2);
    displayMarkers.push(sprite);
    sprite.anchor.setTo(1, 0.45);

}

SinglePlayer.prototype.onCollideBall = function(_ball, _board){
    var degree = 0;
    if(_board.x < _ball.x && _board.body.velocity.x > 0){
        degree = 45*_board.body.velocity.x/Settings.player.maxVelocity.x;
    }else
    if(_board.body.velocity.x < 0){
        degree = 45*_board.body.velocity.x/Settings.player.maxVelocity.x;
    }
        _ball.body.velocity.rotate(0, 0, degree, true);
    
}

SinglePlayer.prototype.onWin = function(_ball, _t){
    this.score.player++;
    if(this.score.player === Settings.winScore){
        this.win();
    }else{
        this.reposition();
    }
}

SinglePlayer.prototype.onLoose = function(_ball, _t){
    this.score.enemy++;
    if(this.score.enemy === Settings.winScore){
        this.loose();
    }else{
        this.reposition();
    }
}

SinglePlayer.prototype.win = function(){
    this.ball.exists = false;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.text = "Player win";
    this.msg.visible = true;
}

SinglePlayer.prototype.loose = function(){
    this.ball.exists = false;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.text = "PC win. You lost!";
    this.msg.visible = true;
}

SinglePlayer.prototype.updatePlayerTexture = function(){
    var ctx = this.playerBoardTexture.context;
    this.playerBoardTexture.clear();
    ctx.drawImage(this.cache.getImage('board'),
        0, 0);
    ctx.fillStyle = this.graviScale.color;
    ctx.fillRect(this.graviScale.x, this.graviScale.y, this.graviScale.w*this.playerPowerScale/100, this.graviScale.h);
}

// TODO: add timer recycle
var repositionTimers = [];
SinglePlayer.prototype.reposition = function(){
    this.ball.x = this.world.centerX;
    this.ball.y = this.world.centerY;
    this.ball.body.velocity.set(0);
    this.ball.body.acceleration.set(0);

    enemyBoard.x = this.world.centerX;
    enemyBoard.y = Settings.padding;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);

    this.playerBoard.x = this.world.centerX;
    this.playerBoard.y = this.game.height-Settings.padding;
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.visible = true;

    this.msg.text = "3";
    // this.msg.anchor.set(0.5);
    var msg = this.msg;
    var that = this;

    this.time.events.repeat(Phaser.Timer.SECOND/2, 2,  function(){
        var val = Number(msg.text);
        val--;
        msg.text = val.toString();
    });
 
    this.time.events.add(Phaser.Timer.SECOND/2*3, function(){
        console.log(2);
        msg.visible = false;
        var chance = Math.random();
        
        that.ball.body.velocity.y = Settings.ball.velocity.y;
        if(chance <= 0.5)
            that.ball.body.velocity.y *= -1; 
    });
   
}


