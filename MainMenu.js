Game.MainMenu = function(game) {};

const buttons = [];

Game.MainMenu.prototype = {
  create: function(game) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //music..........................
    mainMusic = game.add.audio("mainMusic");
    mainMusic.play();
    mainMusic.onStop.add(function() {
      mainMusic.play();
    }, this);
    //Images...................
    game.add.image(0, 0, "background");
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

    //Buttons....................
    btn_sfx = game.add.button(
      10,
      this.game.renderer.height / 1.4,
      "btn-sfx",
      toggleSound
    );
    let isSound = false;
    function toggleSound() {
      if (isSound) {
        mainMusic.pause();
        isSound = false;
      } else {
        mainMusic.play();
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

    buttons.push(btn_start, btn_sfx);

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
    buttons.map(it => it.scale.setTo(1));
    buttons
      .filter(it => it.input.pointerOver())
      .map(it2 => it2.scale.setTo(1.1));
  }
};
