var game = new Phaser.Game(400, 300,Phaser.AUTO, 'gravi-pong', { preload: preload, create: create, update: update, render: render });

function preload(){
    game.load.image('board', 'assets/board-blue.png'); 
    game.load.image('ball', 'assets/ball.png');
    game.load.spritesheet('markers', 'assets/markers.png', 9, 9, 3);
}

var playerMaxVelocity = new Phaser.Point(250, 0);
var moveAccelaration = new Phaser.Point(750, 0);
var ballVelocity = new Phaser.Point(0, 250);
var ballMaxVelocity = new Phaser.Point(500, 400);
var drag = 200;
var padding = 25;
var score = {player: 0, enemy: 0, winScore: 3};

var enemyBoard;
var playerBoard;
var playerBoardTexture;
var playerPowerScale = 75;
var scale = {x: 4, y:3, w:88, h: 6, color: "#1b1464", step: 2};
var ball;
var trigger = {};
var scoreText;
var msg;

var cursors;


function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#8a8a35';
    markers();

    playerBoardTexture = game.make.bitmapData(96, 12);
    updatePlayerTexture();

    playerBoard = game.add.sprite(game.world.centerX, game.height-padding, playerBoardTexture);
    playerBoard.anchor.set(0.5);
    game.physics.enable(playerBoard, Phaser.Physics.ARCADE);
    playerBoard.body.collideWorldBounds = true;
    playerBoard.body.drag.set(drag);
    playerBoard.body.maxVelocity.copyFrom(playerMaxVelocity);
    playerBoard.body.immovable = true;

    enemyBoard = game.add.sprite(game.world.centerX, padding, 'board');
    game.physics.enable(enemyBoard, Phaser.Physics.ARCADE);
    enemyBoard.anchor.set(0.5);
    enemyBoard.body.collideWorldBounds = true;
    enemyBoard.body.drag.set(drag);
    enemyBoard.body.maxVelocity.copyFrom(playerMaxVelocity);
    enemyBoard.body.immovable = true;


    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.set(0.5);
    ball.body.collideWorldBounds = true;
    var chance = Math.random();
    ball.body.velocity.y = ballVelocity.y;
    if(chance <= 0.5)
        ball.body.velocity.y *= -1;

    ball.body.bounce.set(1);




    trigger.win = game.add.sprite(0, 0, null);
    game.physics.arcade.enable(trigger.win);
    trigger.win.body.setSize(game.width, enemyBoard.top, 0, 0);

    trigger.loose = game.add.sprite(0, playerBoard.bottom, null);
    game.physics.arcade.enable(trigger.loose);
    trigger.loose.body.setSize(game.width, game.height - playerBoard.bottom, 0, 0);


    cursors = game.input.keyboard.createCursorKeys();


    scoreText = game.add.text(game.width - 60, 8, "0 - 0", {font: "18px Arial"});
    msg = game.add.text(game.world.centerX, game.world.centerY, "3");
    msg.anchor.set(0.5);
    msg.setStyle({fontSize:"20px"});
    msg.visible = false;
    // scoreText.anchor.set(0.5, 0.5);
}


function update(){
    game.physics.arcade.collide(ball, playerBoard, onCollideBall, null, this);
    game.physics.arcade.collide(ball, enemyBoard);
    game.physics.arcade.overlap(ball, trigger.win, trigger.onWin);
    game.physics.arcade.overlap(ball, trigger.loose, trigger.onLoose);

    scoreText.text = score.player + " - " + score.enemy;

    if(cursors.right.isDown){
        playerBoard.body.acceleration.setTo(moveAccelaration.x, moveAccelaration.y);
        enemyBoard.body.acceleration.setTo(moveAccelaration.x*1.5, moveAccelaration.y);
    }
    else
    if(cursors.left.isDown){
        playerBoard.body.acceleration.setTo(-moveAccelaration.x, moveAccelaration.y);
        enemyBoard.body.acceleration.setTo(-moveAccelaration.x*1.5, moveAccelaration.y);
    }
    else
       {
        playerBoard.body.acceleration.setTo(0);
        enemyBoard.body.acceleration.setTo(0);
    }

    if(cursors.up.isDown && playerPowerScale > 0){
        ball.body.velocity.add(0, -3);
        if(playerPowerScale > 0)
        playerPowerScale-=scale.step;
    }
    else
    if(cursors.down.isDown && playerPowerScale < 100){
        ball.body.velocity.add(0, 3);
        playerPowerScale+=scale.step;
    }
  

    updatePlayerTexture();

}

function render(){
    game.debug.body(trigger.win);
}

var displayMarkers = [];
function markers () {
    var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'markers', 0);
    displayMarkers.push(sprite);
    sprite.anchor.set(0.45);

    var sprite = game.add.sprite(0, game.world.centerY, 'markers', 1);
    displayMarkers.push(sprite);
    sprite.anchor.setTo(0, 0.45);

    var sprite = game.add.sprite(game.width, game.world.centerY, 'markers', 2);
    displayMarkers.push(sprite);
    sprite.anchor.setTo(1, 0.45);

}

function onCollideBall(_ball, _board){
    var degree = 0;
    if(_board.x < _ball.x && _board.body.velocity.x > 0){
        degree = 45*_board.body.velocity.x/playerMaxVelocity.x;
    }else
    if(_board.body.velocity.x < 0){
        degree = 45*_board.body.velocity.x/playerMaxVelocity.x;
    }
        _ball.body.velocity.rotate(0, 0, degree, true);
    
}

trigger.onWin = function(_ball, _t){
    score.player++;
    if(score.player === score.winScore){
        win();
    }else{
        reposition();
    }
}

trigger.onLoose = function(_ball, _t){
    score.enemy++;
    if(score.enemy === score.winScore){
        loose();
    }else{
        reposition();
    }
}

function win(){
    ball.exists = false;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);
    playerBoard.body.velocity.set(0);
    playerBoard.body.acceleration.set(0);

    msg.text = "Player win";
    msg.visible = true;
}

function loose(){
    ball.exists = false;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);
    playerBoard.body.velocity.set(0);
    playerBoard.body.acceleration.set(0);

    msg.text = "PC win. You lost!";
    msg.visible = true;
}

function updatePlayerTexture(){
    var ctx = playerBoardTexture.context;
    playerBoardTexture.clear();
    ctx.drawImage(game.cache.getImage('board'),
        0, 0);
    ctx.fillStyle = scale.color;
    ctx.fillRect(scale.x, scale.y, scale.w*playerPowerScale/100, scale.h);
}

// TODO: add timer recycle
var repositionTimers = [];
function reposition(){
    ball.x = game.world.centerX;
    ball.y = game.world.centerY;
    ball.body.velocity.set(0);
    ball.body.acceleration.set(0);

    enemyBoard.x = game.world.centerX;
    enemyBoard.y = padding;
    enemyBoard.body.velocity.set(0);
    enemyBoard.body.acceleration.set(0);

    playerBoard.x = game.world.centerX;
    playerBoard.y = game.height-padding;
    playerBoard.body.velocity.set(0);
    playerBoard.body.acceleration.set(0);

    msg.visible = true;

    msg.text = "3";
    msg.anchor.set(0.5);
    game.time.events.repeat(Phaser.Timer.SECOND/2, 2,  function(){
        var val = Number(msg.text);
        val--;
        msg.text = val.toString();
    });
 
    game.time.events.add(Phaser.Timer.SECOND/2*3, function(){
        console.log(2);
        msg.visible = false;
        var chance = Math.random();
        
        ball.body.velocity.y = ballVelocity.y;
        if(chance <= 0.5)
            ball.body.velocity.y *= -1; 
    });
   
}
