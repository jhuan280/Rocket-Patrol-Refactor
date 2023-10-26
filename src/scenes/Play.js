class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }


    preload(){
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield2', './assets/starfield2.png');

        this.load.image('meteor4', './assets/meteor4.png');
        this.load.image('shooting_star5', './assets/shooting_star5.png');

        //special ship
        this.load.image('jet', './assets/jet.png');

        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){
        //starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield2').setOrigin(0, 0);

        this.meteor = this.add.tileSprite(0, 0, 640, 480, 'meteor4').setOrigin(0,0);
        this.shootingStar = this.add.tileSprite(0, 0, 640, 480, 'shooting_star5').setOrigin(0,0);

        //this.add.text(20, 20, "Rocket Patrol Play");
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
       
        this.jet = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 8, 'jet', 0, 40).setOrigin(0, 0);
        
        //keyboard inputs
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;

        //display score
        scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        
        //Game Over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'Game Over', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;

            //keeping highscore
            currentScore = this.p1Score;
            if (currentScore > highScore){
                highScore = currentScore;
                this.highScore.setText('High Score: ' + highScore);
            }
        }, null, this);

        //Display the time remaining
        this.timeTotal = game.settings.gameTimer;

        //time config
        let timeConfig = {
            //taken from scoreConfig
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeRemain = this.add.text(game.config.width/1.2, borderUISize + borderPadding * 2, this.timeTotal - 1000, timeConfig).setOrigin(0.5, 0);

        //decrease time
        this.timeDecrease = this.time.addEvent({
            delay: 1000,
            callback: () =>{
                this.timeTotal -= 1000,
                this.timeRemain.text = this.timeTotal - 1000;
            },
            // this.timeRemain.text = this.timeTotal,
            callBackScope: this,
            loop: true
        });


        //display Fire UI
        // if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring){
        this.fire = this.add.text(game.config.width/3.3, borderUISize + borderPadding * 2, 'FIRE', scoreConfig).setOrigin(0.5, 0);
            //this.add.text('FIRE');
        // }
        //fire = this.add.text(game.config.width/2, game.config.height/2, 'FIRE', scoreConfig).setOrigin(0.5, 5.2);

        //tracking high score
        this.highScore = this.add.text(game.config.width/2.7, borderUISize + borderPadding * 2, 'High Score: ' + highScore, scoreConfig).setOrigin(0, 0);

        //currentScore = this.p1Score;
        //this.highScore = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        //playing music
        let loopConfig = {
            volume: 0.5,
            loop: true
        }

        this.music = this.sound.add('NCS 2', loopConfig); 

        //pause music
        if (!this.gameOver){
            this.music.play();            
        }
        else{
            this.music.stop();
        }

    }


    update(){

        //timer will not go past 0 seconds
        if (this.timeTotal <= 0){
            this.timeDecrease.paused = true;
        }

        //increases the ship speed after 30 seconds
        if (this.timeTotal == 30){
            this.ship01.speed30();
            this.ship02.speed30();
            this.ship03.speed30();
            this.jet.speed30();
        }

        //fire UI
        if (this.p1Rocket.isFiring){
            //this.fire = this.add.text(game.config.width/2, borderUISize + borderPadding * 2, 'FIRE', scoreConfig).setOrigin(0.5, 0);
            this.fire.setText('FIRE');
        }
        else{
            //this.fire.setText('');
            this.fire.setText('');
        }


        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){

            //gets rid of console error
            this.sound.play('sfx_select');
            this.music.stop();
            //this.anims.remove('explosion');
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.sound.play('sfx_select');
            this.music.stop();
            //this.anims.remove('explosion');
            this.scene.start("menuScene");

        }
        
        this.starfield.tilePositionX -= 4;
        this.meteor.tilePositionX -= 1;
        this.shootingStar.tilePositionX -= 3;

        if(!this.gameOver){
            this.p1Rocket.update();

            //updates spaceships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();

            this.jet.update();
        }

        //check collisions
        if (this.checkCollision(this.p1Rocket, this.jet)){
            this.p1Rocket.reset();
            this.shipExplode(this.jet);
        }

        if (this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true;
            }

        else{
            return false;
        }
    }

    shipExplode(ship){
        //temporarily hide ship
        ship.alpha = 0;
    
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after anim completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite

        });

        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        let random = (Math.floor(Math.random() * 10));
        if (random == 0 || random == 1){
            this.sound.play('sfx_explosion');
        }

        if (random == 2 || random == 3){
            this.sound.play('explosion1');
        }

        if (random == 4 || random == 5){
            this.sound.play('explosion2');
        }

        if (random == 6 || random == 7){
            this.sound.play('explosion3');
        }

        if (random == 8 || random == 9){
            this.sound.play('explosion4');
        }



    }
}