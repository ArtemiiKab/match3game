Game.EndGame = function(game) {};
Game.EndGame.prototype = {
  create: function(game) {
    //screen size will be set automatically
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

    this.timeup = this.game.add.image(
      this.game.world.centerX,
      this.game.world.centerY - this.game.cache.getImage("timeup").height,
      "timeup"
    );

    this.timeup.anchor.set(0.5, 0.5);

    this.timeup.alpha = 0;

    this.game.add
      .tween(this.timeup)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    console.log(score);
    this.createScore();
  },
  createScore: function() {
    this.scoreTable = this.game.add.image(
      this.game.world.centerX,
      this.game.renderer.height - this.game.cache.getImage("bg-score").height,
      "bg-score"
    );

    this.scoreTable.scale.setTo(0.7);
    this.scoreTable.anchor.set(0.5, 0.5);
    this.scoreLabel = this.game.add.text(
      this.scoreTable.x,
      this.scoreTable.y,
      score,
      {
        font: "50px Fredoka One",
        fill: "#fff",
        align: "right"
      }
    );
    this.scoreLabel.anchor.setTo(0.5, 0.6);
    this.scoreTable.alpha = 0;
    this.scoreLabel.alpha = 0;

    this.game.add
      .tween(this.scoreTable)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000);
    this.game.add
      .tween(this.scoreLabel)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000);

    this.game.add.tween(this.scoreTable.scale).to(
      { x: 1.1, y: 1.1 },
      1000,
      Phaser.Easing.Linear.None,
      true,

      1,
      1,
      1000,
      true,
      3000
    );

    this.game.add
      .tween(this.scoreLabel.scale)
      .to(
        { x: 1.8, y: 1.8 },
        1000,
        Phaser.Easing.Linear.None,
        true,
        1,
        1,
        1000,
        true,
        3000
      );
  }
};
