class Scene1 extends Phaser.Scene {
  create() {
    var color = Phaser.Display.Color.IntegerToColor(0xfcc544);
    this.c1 = this.add.circle(200, 200, 40, 0x44fcf6);
    this.c2 = this.add.circle(16, 160, 50, 0xfcc544);
    this.r1 = this.add.rectangle(300, 560, 400, 20, 0xfcc544);

    this.physics.add.existing(this.r1, true);

    this.circles = this.add.group();
    this.circles.add(this.c1);
    this.circles.add(this.c2);




    this.velocityCollision(this.c1, velocity, 40);
    this.velocityCollision(this.c2, velocity*2, 50);

    this.physics.add.collider(this.circles, this.r1);
    // this.physics.add.overlap(this.circles, this.r1, function(circle, r1){
    //       r1.scale();
    // });
    this.physics.add.collider(this.c1, this.c2);
  }

  velocityCollision(object, vel, r) {
    this.physics.add.existing(object);
    object.body.setCircle(r);
    object.body.velocity.x = vel;
    object.body.velocity.y = vel;
    object.body.bounce.x = 1;
    object.body.bounce.y = 1;
    object.body.collideWorldBounds = true;
  }

  update() {

    

  }
}
