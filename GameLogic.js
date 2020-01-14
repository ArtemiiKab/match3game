Game.GameLogic = function(game) {};
let score = 0;

Game.GameLogic.prototype = {
  create: function(game) {
    //screen size will be set automatically
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

    this.SelectedGem = null;
    this.SwapGem = null;
    this.canMove = false;

    this.gemImageWidth = game.cache.getImage("gem-01").width;
    this.gemImageHeight = game.cache.getImage("gem-01").height;

    //choose the number of gem types , rows, cols of matrix
    this.gemTypes = 6;
    this.Rows = 5;
    this.Cols = 8;

    this.gems = game.add.group();
    //building a virtual matrix depending on choosen rows and cols and fill every element with null
    this.gemMatrix = Array.from({ length: this.Cols }, _ =>
      Array.from({ length: this.Rows }, _ => null)
    );
    this.fillMatrixWithGems();

    //choose game duration in sec
    this.gameDuration = 30;

    this.createScore();
    this.createPointer();
    this.createAudio();
    this.createParticles();
    this.createTimeWarner();
    //count seconds for a timer
    game.time.events.loop(Phaser.Timer.SECOND, this.countSec, this);
    //end game according to duration
    this.timer = game.time.events.add(
      Phaser.Timer.SECOND * this.gameDuration,
      this.endGame,
      this
    );
  },

  update: function(game) {
    //Pointer tracking
    if (
      game.physics.arcade.distanceToPointer(
        this.pointer,
        game.input.activePointer
      ) > 40
    ) {
      game.physics.arcade.moveToPointer(this.pointer, 1500);
    } else {
      this.pointer.body.velocity.set(0);
    }

    // checking
    this.checkIfSelectedGemMoved();
  },

  fillMatrixWithGems: function() {
    this.gemMatrix.map((it, index) =>
      it.map(
        (it2, index2) =>
          (this.gemMatrix[index][index2] = this.addGem(index, index2))
      )
    );

    //check for accidental matches
    const here = this;
    this.game.time.events.add(600, function() {
      here.checkForMatches();
    });
  },

  addGem: function(x, y) {
    //Choose a random gem color
    const gemColor = "gem-0" + Math.ceil(Math.random() * this.gemTypes);

    //place gems and make them fall down
    const gem = this.gems.create(
      x * this.gemImageWidth + this.gemImageWidth / 2,
      0,
      gemColor
    );

    this.game.add
      .tween(gem)
      .to(
        { y: y * this.gemImageHeight + this.gemImageHeight / 2 },
        500,
        Phaser.Easing.Linear.In,
        true
      );

    //make gem clickable
    gem.anchor.setTo(0.5, 0.5);
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.gemOnClick, this);
    gem.events.onInputUp.add(this.gemOnRelease, this);

    return gem;
  },
  gemOnRelease: function(gem, pointer) {
    //return gem to it's normal size
    gem.scale.setTo(1);
  },

  gemOnClick: function(gem, pointer) {
    if (this.canMove) {
      this.SelectedGem = gem;
      //make gem bigger for UX
      this.SelectedGem.scale.setTo(1.1);
      //find the click on a matrix
      this.startPosX = (gem.x - this.gemImageWidth / 2) / this.gemImageWidth;
      this.startPosY = (gem.y - this.gemImageHeight / 2) / this.gemImageHeight;
      if (isSound) this.selectSound.play();
    }
  },

  checkIfSelectedGemMoved: function() {
    if (this.SelectedGem && !this.SwapGem) {
      //find pointer on a matrix
      const inputX = Math.floor(this.game.input.x / this.gemImageWidth);
      const inputY = Math.floor(this.game.input.y / this.gemImageHeight);

      //find the difference between clicked and dragged input
      const difX = Math.abs(inputX - this.startPosX);
      const difY = Math.abs(inputY - this.startPosY);

      if (
        (inputY > 0 || inputY < this.gemMatrix[0].length - 1) &&
        (inputX > 0 || inputX < this.gemMatrix.length - 1)
      ) {
        //prevent diagonal moves
        if ((difY == 1 && difX == 0) || (difX == 1 && difY == 0)) {
          this.canMove = false;
          this.SwapGem = this.gemMatrix[inputX][inputY];
          this.swapBothGems();

          const here = this;
          //check matches after swap
          this.game.time.events.add(500, function() {
            here.checkForMatches();
          });
        }
      }
    }
  },

  swapBothGems: function() {
    if (this.SelectedGem && this.SwapGem) {
      //variables for swap
      const gemSelPos = {
        x: (this.SelectedGem.x - this.gemImageWidth / 2) / this.gemImageWidth,
        y: (this.SelectedGem.y - this.gemImageHeight / 2) / this.gemImageHeight
      };
      const gemSwapPos = {
        x: (this.SwapGem.x - this.gemImageWidth / 2) / this.gemImageWidth,
        y: (this.SwapGem.y - this.gemImageHeight / 2) / this.gemImageHeight
      };

      //Swap them in matrix
      this.gemMatrix[gemSelPos.x][gemSelPos.y] = this.SwapGem;
      this.gemMatrix[gemSwapPos.x][gemSwapPos.y] = this.SelectedGem;

      //Swap on screen
      this.game.add.tween(this.SelectedGem).to(
        {
          x: gemSwapPos.x * this.gemImageWidth + this.gemImageWidth / 2,
          y: gemSwapPos.y * this.gemImageHeight + this.gemImageHeight / 2
        },
        200,
        Phaser.Easing.Linear.In,
        true
      );
      this.game.add.tween(this.SwapGem).to(
        {
          x: gemSelPos.x * this.gemImageWidth + this.gemImageWidth / 2,
          y: gemSelPos.y * this.gemImageHeight + this.gemImageHeight / 2
        },
        200,
        Phaser.Easing.Linear.In,
        true
      );
    }
  },
  checkForMatches: function() {
    const here = this;
    //find matches
    const matches = this.getMatches(this.gemMatrix);

    if (matches.length > 0) {
      this.destroyGems(matches);
      this.rotateGems();
      this.refillMatrix();

      this.game.time.events.add(500, function() {
        here.SelectedGem = null;
        here.SwapGem = null;
      });

      this.game.time.events.add(500, function() {
        here.checkForMatches();
      });
    } else {
      //swap back if no match
      this.swapBothGems();
      this.game.time.events.add(500, function() {
        here.SelectedGem = null;
        here.SwapGem = null;
        here.canMove = true;
      });
    }
  },

  getMatches: function(gemMatrix) {
    const matches = [];

    //Check for vertical matches and add all matched gems to the groups

    gemMatrix.map((it, index, arr) =>
      it
        .filter(
          (it2, index2, arr2) =>
            (index2 < arr2.length - 2 &&
              it2.key === arr2[index2 + 1].key &&
              arr2[index2 + 1].key === arr2[index2 + 2].key) ||
            (index2 > 1 &&
              it2.key === arr2[index2 - 1].key &&
              arr2[index2 - 1].key === arr2[index2 - 2].key) ||
            (index2 > 0 &&
              index2 < arr2.length - 1 &&
              it2.key === arr2[index2 - 1].key &&
              arr2[index2 - 1].key === arr2[index2 + 1].key)
        )
        .map(it => matches.push(it))
    );

    //Check for horizontal matches and add all matched gems to the groups
    gemMatrix.map((it, index, arr1) =>
      it
        .filter(
          (it2, index2) =>
            (index < arr1.length - 2 &&
              it2.key === arr1[index + 1][index2].key &&
              arr1[index + 1][index2].key === arr1[index + 2][index2].key) ||
            (index > 1 &&
              it2.key === arr1[index - 1][index2].key &&
              arr1[index - 1][index2].key === arr1[index - 2][index2].key) ||
            (index > 0 &&
              index < arr1.length - 1 &&
              it2.key === arr1[index - 1][index2].key &&
              arr1[index - 1][index2].key === arr1[index + 1][index2].key)
        )
        .map(it => matches.push(it))
    );

    return matches;
  },
  destroyGems: function(matches) {
    matches.map(
      it =>
        (this.gemMatrix[Math.floor(it.x / this.gemImageWidth)][
          Math.floor(it.y / this.gemImageHeight)
        ] = null)
    );
    matches.map(it => this.gems.remove(it));
    matches.map(it => this.gemExplode(it));
    this.incrementScore(matches);
    if (isSound) this.killSound.play();
  },
  rotateGems: function() {
    this.gemMatrix.map((it, index) =>
      it.map((it2, index2, arr) => this.rotateGemDown(it2, index, index2, arr))
    );
  },
  rotateGemDown: function(it, index, index2, arr) {
    if (it === null && index2 > 0 && arr[index2 - 1] !== null) {
      let upperGem = arr[index2 - 1];
      this.gemMatrix[index][index2] = upperGem;
      this.gemMatrix[index][index2 - 1] = null;

      this.game.add
        .tween(upperGem)
        .to(
          { y: this.gemImageHeight * index2 + this.gemImageHeight / 2 },
          200,
          Phaser.Easing.Linear.in,
          true
        );
      //do it again until every gem fell
      this.rotateGems();
    }
  },
  refillMatrix: function() {
    this.gemMatrix.map((it, index) =>
      it.map((it2, index2) => this.createNewGem(it2, index, index2))
    );
  },
  createNewGem: function(it2, index, index2) {
    if (it2 === null) {
      this.gemMatrix[index][index2] = this.addGem(index, index2);
    }
  },
  createScore: function() {
    this.scoreTable = this.game.add.image(
      this.game.renderer.width / 1.8,
      this.game.renderer.height -
        this.game.cache.getImage("bg-score").height / 2,
      "bg-score"
    );

    this.scoreTable.scale.setTo(0.7);
    score = 0;
    this.scoreLabel = this.game.add.text(
      this.scoreTable.x + this.scoreTable.width / 2,
      this.scoreTable.y + this.scoreTable.height / 4,
      "0",
      {
        font: "50px Fredoka One",
        fill: "#fff",
        align: "right"
      }
    );
    this.scoreLabel.anchor.setTo(0.5, 0);
  },

  incrementScore: function(matches) {
    if (matches.length === 3) {
      score += 100;
    } else {
      //for more then 3 matches bonus
      score += matches.length * 100;
    }
    this.scoreLabel.text = score;
  },
  createPointer: function() {
    this.pointer = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      "pointer"
    );
    this.pointer.anchor.set(0.3, 0.1);
    this.pointer.scale.setTo(0.5);
    this.game.physics.enable(this.pointer, Phaser.Physics.ARCADE);
  },
  createAudio: function() {
    this.killSound = this.game.add.audio("kill");
    this.selectSound = this.game.add.audio("selectSound");
    this.mainMusic = this.game.add.audio("mainMusic");

    this.mainMusic.onStop.add(function() {
      if (isSound) this.mainMusic.play();
    }, this);
  },
  endGame: function() {
    this.game.state.start("EndGame");
  },
  createTimeWarner: function() {
    this.count = this.game.add.text(
      this.gemImageHeight / 2,
      this.scoreTable.y + this.scoreTable.height / 4,
      "TIME LEFT: " + (this.gameDuration - 1),
      {
        font: "50px Fredoka One",
        fill: "#e85656",
        align: "right",
        stroke: "#fff",
        strokeThickness: 8
      }
    );
  },
  countSec: function() {
    this.gameDuration--;
    this.count.text = "TIME LEFT: " + (this.gameDuration - 1);
  },

  createParticles: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.emitter = this.game.add.emitter(0, 0, 100);
    this.emitter.makeParticles(["particlegem-01", "particlegem-05"]);
    this.emitter.maxParticleScale = 0.1;
  },

  gemExplode: function(gem) {
    this.emitter.x = gem.x;
    this.emitter.y = gem.y;
    this.emitter.start(true, 300, null, 10);
  }
};
