var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var puText;
var powerupEnabled;
var powerupDuration = 0;
var game = new Phaser.Game(config);

function decreasePowerUp () {
    console.log("decreasePowerUp running");
    if (powerupDuration > 0) {
        powerupEnabled = true;
    } else {
        powerupEnabled = false;
    }
    if (powerupEnabled) {
        powerupDuration -= 1;
    }
    setTimeout(decreasePowerUp, 1000);
}

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('powerup', 'assets/power-up-star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/new-dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    setTimeout(decreasePowerUp, 1000);
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(300, 400, 'ground');
    platforms.create(50, 150, 'ground');
    platforms.create(560, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    powerups = this.physics.add.group({
        key: 'powerup',
        repeat: 0,
        setXY: { x: 325, y: 0, stepX: 70 }
    });

    powerups.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    highText = this.add.text(400, 16, 'High Score: ' + localStorage.getItem("highScore"), { fontSize: '32px', fill: '#000' });
    puText = this.add.text(250, 550, 'NO POWERUP', { fontSize: '32px', fill: '#0000FF', fontFamily: 'Impact', backgroundColor: 'white' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(powerups, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.overlap(player, powerups, collectPowerUp, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (powerupEnabled) {
        puText.setText("POWERUP ENABLED: " + powerupDuration);
    } else {
        puText.setText("NO POWERUP");
    }
    if (gameOver)
    {
        this.add.text(250, 200, 'GAME OVER', { fontSize: '70px', fill: '#FF0000', fontFamily: 'Impact'});
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function randInt(max) {
  var num = Math.floor(Math.random()*max) + 1;
  return num;
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {

        if (Math.random() <= 0.35) {
          powerups.children.iterate(function (child) {

              child.enableBody(true, randInt(800), 0, true, true);

          });
        }

        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function collectPowerUp (player, powerup)
{
    // powerup will disable in 10 sec
    // even if collected again
    powerup.disableBody(true, true);

    powerupDuration += 10;
    powerupEnabled = true;
}

function hitBomb (player, bomb)
{
    if (powerupDuration > 0) {

    } else {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        if (localStorage.getItem("highScore")) {
            if (score > localStorage.getItem("highScore")) {
                localStorage.setItem("highScore", score);
            }
        } else {
            localStorage.setItem("highScore", score);
        }

        gameOver = true;
    }
}
