window.onload = function(){

    var config = {
        width: 800,
        height: 600,
        backgroundColor: 0xfff5db,
        scene: [Scene1],
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
            }
        }
    }
    var game = new Phaser.Game(config);
}

var velocity = 300;