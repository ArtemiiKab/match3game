Game.MainMenu = function(game) {};

let isSound = true;
let ismainTheme = false;

Game.MainMenu.prototype = {
  create: function(game) {
    //screen size will be set automatically
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
    //music

    if (isSound && !ismainTheme) {
      mainMusic = game.add.audio("mainMusic");
      ismainTheme = true;
      mainMusic.play();
    }
    mainMusic.onStop.add(function() {
      mainMusic.play();
    }, this);

    //images

    logo = game.add.image(
      this.game.world.centerX,
      game.cache.getImage("logo").height / 2,
      "logo"
    );
    logo.anchor.set(0.5, 0.5);
    game.add.tween(logo.scale).to(
      { x: 1.1, y: 1.1 },
      2000,
      Phaser.Easing.Linear.None,
      true,

      1,
      1,
      2000,
      true
    );

    donut = game.add.image(game.renderer.width, game.renderer.height, "donut");
    donut.anchor.set(0.5, 0.5);
    donutTween = game.add
      .tween(donut.scale)
      .to({ x: 0.9, y: 0.9 }, 2000, "Linear", true, 1, 1, 2000, true);

    //buttons
    this.buttons = [];
    btn_sfx = game.add.button(
      10,
      this.game.renderer.height / 1.4,
      "btn-sfx",
      toggleSound
    );

    function toggleSound() {
      if (isSound) {
        console.log("sound off");
        mainMusic.pause();
        isSound = false;
      } else {
        console.log("sound on");
        mainMusic.resume();
        isSound = true;
      }
    }
    btn_start = game.add.button(
      game.world.centerX,
      game.world.centerY + 100,
      "btn-play",
      function() {
        game.state.start("GameLogic");
      }
    );
    btn_start.anchor.set(0.5, 0.5);
    btn_start.alpha = 0;

    game.add
      .tween(btn_start)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000);

    this.buttons.push(btn_start, btn_sfx);

    //finger pointer
    pointer = game.add.sprite(
      game.world.centerX,
      game.world.centerY,
      "pointer"
    );
    pointer.anchor.set(0.3, 0.1);
    game.physics.enable(pointer, Phaser.Physics.ARCADE);
  },
  update: function(game) {
    //make a finger pointer work as a mouse
    if (
      game.physics.arcade.distanceToPointer(pointer, game.input.activePointer) >
      40
    ) {
      game.physics.arcade.moveToPointer(pointer, 1500);
    } else {
      pointer.body.velocity.set(0);
    }
    // buttons hover
    this.buttons.map(it => it.scale.setTo(1));
    this.buttons
      .filter(it => it.input.pointerOver())
      .map(it2 => it2.scale.setTo(1.1));
  }
};
