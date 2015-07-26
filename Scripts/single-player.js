function SinglePlayer(){
	 this.playerMaxVelocity = new Phaser.Point(250, 0);
	 this.moveAccelaration = new Phaser.Point(750, 0);
	 this.ballVelocity = new Phaser.Point(0, 250);
	 this.ballMaxVelocity = new Phaser.Point(500, 400);
	 this.drag = 200;
	 this.padding = 25;
	 this.score = {player: 0, enemy: 0, winScore: 3};

	 this.enemyBoard;
	 this.playerBoard;
	 this.playerBoardTexture;
	 this.playerPowerScale = 75;
	 this.graviScale = {x: 4, y:3, w:88, h: 6, color: "#1b1464", step: 2};
	 this.ball;
	 this.trigger = {};
	 this.scoreText;
	 this.msg;

	 this.cursors;
}

SinglePlayer.prototype.preload = function(){
    this.load.image('board', 'assets/board-blue.png'); 
    this.load.image('ball', 'assets/ball.png');
    this.load.spritesheet('markers', 'assets/markers.png', 9, 9, 3);
}

SinglePlayer.prototype.create = function(){
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.stage.backgroundColor = '#8a8a35';
    this.markers();

    this.playerBoardTexture = this.make.bitmapData(96, 12);
    this.updatePlayerTexture();

    this.playerBoard = this.add.sprite(this.world.centerX, this.game.height-this.padding, this.playerBoardTexture);
    this.playerBoard.anchor.set(0.5);
    this.physics.enable(this.playerBoard, Phaser.Physics.ARCADE);
    this.playerBoard.body.collideWorldBounds = true;
    this.playerBoard.body.drag.set(this.drag);
    this.playerBoard.body.maxVelocity.copyFrom(this.playerMaxVelocity);
    this.playerBoard.body.immovable = true;

    enemyBoard = this.add.sprite(this.world.centerX, this.padding, 'board');
    this.physics.enable(enemyBoard, Phaser.Physics.ARCADE);
    enemyBoard.anchor.set(0.5);
    enemyBoard.body.collideWorldBounds = true;
    enemyBoard.body.drag.set(this.drag);
    enemyBoard.body.maxVelocity.copyFrom(this.playerMaxVelocity);
    enemyBoard.body.immovable = true;


    this.ball = this.add.sprite(this.world.centerX, this.world.centerY, 'ball');
    this.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.anchor.set(0.5);
    this.ball.body.collideWorldBounds = true;
    var chance = Math.random();
    this.ball.body.velocity.y = this.ballVelocity.y;
    if(chance <= 0.5)
        this.ball.body.velocity.y *= -1;

    this.ball.body.bounce.set(1);




    this.trigger.win = this.add.sprite(0, 0, null);
    this.physics.arcade.enable(this.trigger.win);
    this.trigger.win.body.setSize(this.game.width, enemyBoard.top, 0, 0);

    this.trigger.loose = this.add.sprite(0, this.playerBoard.bottom, null);
    this.physics.arcade.enable(this.trigger.loose);
    this.trigger.loose.body.setSize(this.game.width, this.game.height - this.playerBoard.bottom, 0, 0);


    this.cursors = this.input.keyboard.createCursorKeys();


    this.scoreText = this.add.text(this.game.width - 60, 8, "0 - 0", {font: "18px Arial"});
    this.msg = this.add.text(this.world.centerX, this.world.centerY, "3");
    this.msg.anchor.set(0.5);
    this.msg.setStyle({fontSize:"20px"});
    this.msg.visible = false;
    // this.scoreText.anchor.set(0.5, 0.5);
}


SinglePlayer.prototype.update = function(){
    this.physics.arcade.collide(this.ball, this.playerBoard, this.nCollideBall, null, this);
    this.physics.arcade.collide(this.ball, enemyBoard);
    this.physics.arcade.overlap(this.ball, this.trigger.win, this.onWin,null,  this);
    this.physics.arcade.overlap(this.ball, this.trigger.loose, this.onLoose, null, this);

    this.scoreText.text = this.score.player + " - " + this.score.enemy;

    if(this.cursors.right.isDown){
        this.playerBoard.body.acceleration.setTo(this.moveAccelaration.x, this.moveAccelaration.y);
        enemyBoard.body.acceleration.setTo(this.moveAccelaration.x*1.5, this.moveAccelaration.y);
    }
    else
    if(this.cursors.left.isDown){
        this.playerBoard.body.acceleration.setTo(-this.moveAccelaration.x, this.moveAccelaration.y);
        enemyBoard.body.acceleration.setTo(-this.moveAccelaration.x*1.5, this.moveAccelaration.y);
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
        degree = 45*_board.body.velocity.x/this.playerMaxVelocity.x;
    }else
    if(_board.body.velocity.x < 0){
        degree = 45*_board.body.velocity.x/this.playerMaxVelocity.x;
    }
        _ball.body.velocity.rotate(0, 0, degree, true);
    
}

SinglePlayer.prototype.onWin = function(_ball, _t){
    this.score.player++;
    if(this.score.player === this.score.winScore){
        this.win();
    }else{
        this.reposition();
    }
}

SinglePlayer.prototype.onLoose = function(_ball, _t){
    this.score.enemy++;
    if(this.score.enemy === this.score.winScore){
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
    enemyBoard.y = this.padding;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);

    this.playerBoard.x = this.world.centerX;
    this.playerBoard.y = this.game.height-this.padding;
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.visible = true;

    this.msg.text = "3";
    this.msg.anchor.set(0.5);
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
        
        that.ball.body.velocity.y = that.ballVelocity.y;
        if(chance <= 0.5)
            that.ball.body.velocity.y *= -1; 
    });
   
}


