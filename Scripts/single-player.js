Settings = {
	player: {
		maxVelocity: new Phaser.Point(350, 0),
		acceleration: new Phaser.Point(650, 0)
	},

	ball: {
		velocity: new Phaser.Point(0, 250),
		maxVelocity: new Phaser.Point(500, 400),
	},

	winScore: 2,
	drag: 200,
	padding: 25,
}

function SinglePlayer(){
	 this.enemyBoard;
	 this.playerBoard;
	 this.playerBoardTexture;
	 this.playerPowerScale = 75;
	 this.graviScale = {x: 4, y:3, w:88, h: 6, color: "#1b1464", step: 3};
	 this.ball;
	 this.trigger = {};
	 this.scoreText;
	 this.msg;
	 this.score= {player: 0, enemy: 0};
	 this.cursors;
     this.displayMarkers = [];
     this.mainMenuBtn;
	 // this.game.stage.smoothed = false;
}

SinglePlayer.prototype.preload = function(){
    this.load.image('board', 'assets/board-blue.png'); 
    this.load.image('ball', 'assets/ball.png');
    this.load.spritesheet('markers', 'assets/markers.png', 9, 9, 3);
}


SinglePlayer.prototype.create = function(){
    this.physics.startSystem(Phaser.Physics.ARCADE);
  
    this.stage.backgroundColor = '#80c0c5';
      // var background = new TriangBackground(this);
	this.game.stage.smoothed = false;

    this.setUpBall();

    this.setUpPlayer();

    this.setUpEnemy();

    this.setUpTriggers();

    this.setUpGUI();
    this.setUpEndMenu();

    this.cursors = this.input.keyboard.createCursorKeys();
}


SinglePlayer.prototype.update = function(){

    this.physics.arcade.collide(this.ball, this.playerBoard, this.onCollideBall, null, this);
    this.physics.arcade.collide(this.ball, this.enemyBoard, this.onCollideBall, null, this);
    this.physics.arcade.overlap(this.ball, this.trigger.win, this.onWin,null,  this);
    this.physics.arcade.overlap(this.ball, this.trigger.loose, this.onLoose, null, this);

    this.scoreText.text = this.score.player + " - " + this.score.enemy;

    if(this.cursors.right.isDown){
        this.playerBoard.body.acceleration.setTo(Settings.player.acceleration.x, Settings.player.acceleration.y);
        this.enemyBoard.body.acceleration.setTo(Settings.player.acceleration.x*1.5, Settings.player.acceleration.y);
    }
    else
    if(this.cursors.left.isDown){
        this.playerBoard.body.acceleration.setTo(-Settings.player.acceleration.x, Settings.player.acceleration.y);
        this.enemyBoard.body.acceleration.setTo(-Settings.player.acceleration.x*1.5, Settings.player.acceleration.y);
    }
    else
       {
        this.playerBoard.body.acceleration.setTo(0);
        this.enemyBoard.body.acceleration.setTo(0);
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
}


SinglePlayer.prototype.setUpEndMenu = function(){
    var btnWidth = 150;
    var btnHeight = 30;
    var btnBg = "rgb(60, 0, 0)";
    var btnPadding = 15;
    var btnFontColor = "rgb(130, 143, 208)";

    this.mainMenuBtn = new Button("Main menu", "center", this.game.world.centerY/2 + btnPadding, btnWidth, btnHeight, this, btnBg, 
    function(_this){
        return function() {
            _this.state.start("MainMenu");
            _this.game.paused = false;
            _this.mainMenuBtn.sprite.kill();
            _this.restartMenu.sprite.kill();
        }
    }(this)     );
    this.mainMenuBtn.sprite.kill();
    this.mainMenuBtn.fontColor = btnFontColor;

    this.restartMenu = new Button("Restart", "center", this.mainMenuBtn.sprite.bottom + btnPadding, 150, 30, this, "rgb(60, 0, 0)",
    function(_this){
        return function() {
            _this.game.paused = false;
            _this.mainMenuBtn.sprite.kill();
            _this.restartMenu.sprite.kill();
            _this.restartParty();
            _this.score.player = 0;
            _this.score.enemy = 0;
            _this.msg.visible = false;
        }
    }(this)    );
    
    this.restartMenu.sprite.kill();
    this.restartMenu.fontColor = btnFontColor;

    this.mainMenuBtn.handlePause = true;
    this.restartMenu.handlePause = true;
}

SinglePlayer.prototype.startEndMenu = function(){
    this.game.paused = true;
    this.mainMenuBtn.sprite.revive();
    this.restartMenu.sprite.revive();
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
    this.enemyBoard = this.add.sprite(this.world.centerX, Settings.padding, 'board');
    this.physics.enable(this.enemyBoard, Phaser.Physics.ARCADE);
    this.enemyBoard.anchor.set(0.5);
    this.enemyBoard.body.collideWorldBounds = true;
    this.enemyBoard.body.drag.set(Settings.drag);
    this.enemyBoard.body.maxVelocity.copyFrom(Settings.player.maxVelocity);
    this.enemyBoard.body.immovable = true;

    new PrimitiveAI(this, this.enemyBoard, this.ball);
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
    this.trigger.win.body.setSize(this.game.width, this.enemyBoard.top, 0, 0);

    this.trigger.loose = this.add.sprite(0, this.playerBoard.bottom, null);
    this.physics.arcade.enable(this.trigger.loose);
    this.trigger.loose.body.setSize(this.game.width,
         this.game.height - this.playerBoard.bottom, 0, 0);
}

SinglePlayer.prototype.setUpGUI = function() {
    this.markers();

    this.scoreText = this.add.text(this.game.width - 60, 8, "0 - 0", {font: "18px Arial"});

    this.msg = this.add.text(this.world.centerX, this.world.centerY/2, "3");
    this.msg.anchor.set(0.5);
    this.msg.setStyle({fontSize:"21px"});
    this.msg.visible = false;

    this.timerMsg = this.add.text(this.world.centerX, this.ball.top - 10, "3");
    this.timerMsg.anchor.set(0.5);
    this.timerMsg.setStyle({fontSize:"21px"});
    this.timerMsg.visible = false;

};

SinglePlayer.prototype.markers = function () {
    var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'markers', 0);
    this.displayMarkers.push(sprite);
    sprite.anchor.set(0.45);

    var sprite = this.add.sprite(0, this.world.centerY, 'markers', 1);
    this.displayMarkers.push(sprite);
    sprite.anchor.setTo(0, 0.45);

    var sprite = this.add.sprite(this.game.width, this.world.centerY, 'markers', 2);
    this.displayMarkers.push(sprite);
    sprite.anchor.setTo(1, 0.45);
}

SinglePlayer.prototype.onCollideBall = function(_ball, _board){
    var degree = 0;
    var left = _ball.x - _ball.width/4;
    var right = _ball.x + _ball.width/4;
    if(_board.x < left  && _board.body.velocity.x > 0){
        degree = 40*_board.body.velocity.x/Settings.player.maxVelocity.x;
    }else
    if(_board.x > left &&_board.body.velocity.x < 0){
        degree = 40*_board.body.velocity.x/Settings.player.maxVelocity.x;
    }

     _ball.body.velocity.rotate(0, 0, degree, true);
    
}

SinglePlayer.prototype.onWin = function(_ball, _t){
    this.score.player++;
    if(this.score.player === Settings.winScore){
        this.win();
    }else{
        this.restartParty();
    }
}

SinglePlayer.prototype.onLoose = function(_ball, _t){
    this.score.enemy++;
    if(this.score.enemy === Settings.winScore){
        this.loose();
    }else{
        this.restartParty();
    }
}

SinglePlayer.prototype.win = function(){
    this.ball.exists = false;
    this.enemyBoard.body.velocity.set(0);
    this.enemyBoard.body.acceleration.set(0);
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.text = "Player win";
    this.msg.visible = true;
    this.startEndMenu();
}

SinglePlayer.prototype.loose = function(){
    this.ball.exists = false;
    this.enemyBoard.body.velocity.set(0);
    this.enemyBoard.body.acceleration.set(0);
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);

    this.msg.text = "PC win. You lost!";
    this.msg.visible = true;
    this.startEndMenu();
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
SinglePlayer.prototype.reposition = function(){
    this.ball.exists = true;
    this.ball.anchor.set(0.5);
    this.ball.body.velocity.set(0);
    this.ball.body.acceleration.set(0);
    this.ball.x = this.world.centerX;
    this.ball.y = this.world.centerY;

    this.enemyBoard.x = this.world.centerX;
    this.enemyBoard.y = Settings.padding;
    this.enemyBoard.body.velocity.set(0);
    this.enemyBoard.body.acceleration.set(0);

    this.playerBoard.x = this.world.centerX;
    this.playerBoard.y = this.game.height-Settings.padding;
    this.playerBoard.body.velocity.set(0);
    this.playerBoard.body.acceleration.set(0);
}


SinglePlayer.prototype.restartParty = function(){
    this.reposition();

    this.timerMsg.visible = true;

    this.timerMsg.text = "3";
    var msg = this.timerMsg;
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
