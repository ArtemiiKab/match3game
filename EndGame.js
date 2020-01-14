Game.EndGame = function(game) {};
Game.EndGame.prototype = {
  create: function(game) {
    this.game.add.image(0, 0, "background");
    this.timeup = this.game.add.image(
      this.game.world.centerX,
      this.game.world.centerY - game.cache.getImage("timeup").height,
      "timeup"
    );

    this.timeup.anchor.set(0.5, 0.5);

    this.timeup.alpha = 0;

    game.add
      .tween(this.timeup)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    console.log(score);
    this.createScore();
  },
  createScore: function() {
    this.scoreTable = game.add.image(
      this.game.world.centerX,
      this.game.renderer.height - game.cache.getImage("bg-score").height,
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

    game.add
      .tween(this.scoreTable)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000);
    game.add
      .tween(this.scoreLabel)
      .to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000);

    game.add.tween(this.scoreTable.scale).to(
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

    game.add
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
