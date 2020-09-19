class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      "background"
    );
    this.background.setOrigin(0, 0);
    // this.bg_1 = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "bg_1");
    // this.bg_1.setOrigin(0, 0);
    // this.bg_1.setScrollFactor(0);


    this.ship1 = this.add.sprite(
      this.game.config.width / 2 - 50,
      this.game.config.height / 2,
      "ship"
    );
    this.ship2 = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "ship2"
    );
    this.ship3 = this.add.sprite(
      this.game.config.width / 2 + 50,
      this.game.config.height / 2,
      "ship3"
    );

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gameobjectdown", this.destroyShip, this);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x0000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.game.config.width, 0);
    graphics.lineTo(this.game.config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;    
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);

    this.powerUps = this.physics.add.group();

    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(
        0,
        0,
        this.game.config.width,
        this.game.config.height
      );

      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.player = this.physics.add.sprite(
      this.game.config.width / 2 - 8,
      this.game.config.height - 64,
      "player"
    );
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.projectiles = this.add.group();

    this.physics.add.overlap(this.projectiles, this.powerUps, function (
      projectile,
      powerup
    ) {
      projectile.destroy();
    });

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    // this.myCam = this.cameras.main.startFollow(this.player);
  }

  zeroPad(number, size) {
      var stringNumber = String(number);
      while(stringNumber.length < size){
          stringNumber = '0' + stringNumber;
      }
      return stringNumber;
  }

  hitEnemy(projectile, enemy) {

    var explosion = new Explosion(this, enemy.x, enemy.y);
    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE: " + scoreFormated;
  }

  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);
    if(this.player.alpha<1){
        return;
    }
    var explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);

    // this.resetPlayer();

    this.time.addEvent({
        delay: 1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false,
    })
  }

  resetPlayer(){
    var x = this.game.config.width / 2 - 8;
    var y = this.game.config.height - 64;

    this.player.enableBody(true, x, y, true, true);
    this.player.alpha = 0.5;
    var tween = this.tweens.add({
        targets: this.player,
        y: this.game.config.height - 64,
        ease: 'Power1',
        duration: 1500,
        repeat:0,
        onComplete: function() {
            this.player.alpha = 1;
        },
        callbackScope: this,
    });
    this.score = 0;
    this.scoreLabel.text = "SCORE: " + this.score;
  }

  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > this.game.config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, this.game.config.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
  }

  shootBeam() {
    var beam = new Beam(this);
    this.projectiles.add(beam);
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;
    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if(this.player.active) {
          this.shootBeam();
      }  
    }
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }

    // this.bg_1.titlePositionX = this.myCam.scrollX*0.3;
  }
}
