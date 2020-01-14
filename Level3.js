Game.Level1 = function(game) {};

const gemSize = 100;
let allGems;
const Rows = 5;
const Cols = 8;
const gemMargin = 0;
const gemTypes = 6;
let canMove;

let SelectedGem = null;
let SwapGem = null;

Game.Level1.prototype = {
  create: function(game) {
    canMove = false;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.physics.startSystem(Phaser.Physics.ARCADE);
    //UI........................................

    game.add.image(0, 0, "background");
    score = game.add.image(this.game.renderer.width / 1.8, 2, "bg-score");
    score.scale.setTo(0.7);

    //Create Gem matrix...........................................
    gems = game.add.group();
    createBoard();
    //pointer
    pointer = game.add.sprite(
      game.world.centerX,
      game.world.centerY,
      "pointer"
    );
    pointer.anchor.set(0.3, 0.1);
    pointer.scale.setTo(0.5);
    game.physics.enable(pointer, Phaser.Physics.ARCADE);

    //game.input.addMoveCallback(slideGem, this);
    function createBoard() {
      allGems = new Array(Cols).fill(new Array(Rows).fill(null));
      allGems = allGems.map((it, index) =>
        it.map((it, index2) => addGem(index, index2))
      );
      checkMatches();
    }

    function addGem(x, y) {
      let gem = gems.create(
        (gemMargin + gemSize) * x,
        0,
        "gem-0" + Math.ceil(Math.random() * gemTypes)
      );

      game.add
        .tween(gem)
        .to({ y: gemSize * y }, 400, Phaser.Easing.Linear.In, true);

      gem.inputEnabled = true;
      gem.events.onInputDown.add(chooseGem, this);
      gem.events.onInputUp.add(releaseGem, this);
      return gem;
    }
  },

  update: function(game) {
    //pointer handler
    if (
      game.physics.arcade.distanceToPointer(pointer, game.input.activePointer) >
      40
    ) {
      game.physics.arcade.moveToPointer(pointer, 1500);
    } else {
      pointer.body.velocity.set(0);
    }

    if (SelectedGem !== null && SwapGem === null) {
      let hoverX = getGemPos(game.input.x);
      let hoverY = getGemPos(game.input.y);

      let diffX = hoverX - getGemPos(SelectedGem.x);
      let diffY = hoverY - getGemPos(SelectedGem.y);
      if (
        !(hoverX < 0 || hoverX.x > gemSize * Cols) ||
        !(hoverY > gemSize * Rows || hoverY < 1)
      ) {
        if (
          (Math.abs(diffX) === 1 && diffY === 0) ||
          (Math.abs(diffY) === 1 && diffX === 0)
        ) {
          console.log("hi");
          canMove = false;
          SwapGem = allGems[hoverX][hoverY];

          console.log(SwapGem.x, SwapGem.y, SwapGem.key);
          swapGems();
          game.time.events.add(500, function() {
            checkMatches();
          });
        }
      }
    }
    function swapGems() {
      if (SelectedGem !== null && SwapGem !== null) {
        console.log(allGems.map(it => it.map(it => it.key)));
        let storeTile1 = {
          x: SelectedGem.x,
          y: SelectedGem.y,
          key: SwapGem.key
        };
        let storeTile2 = { x: SwapGem.x, y: SwapGem.y, key: SelectedGem.key };

        allGems[getGemPos(SelectedGem.x)][
          getGemPos(SelectedGem.y)
        ] = storeTile1;

        allGems[getGemPos(SwapGem.x)][getGemPos(SwapGem.y)] = storeTile2;

        game.add
          .tween(SelectedGem)
          .to(
            { x: storeTile2.x, y: storeTile2.y },
            200,
            Phaser.Easing.Linear.In,
            true
          );
        game.add
          .tween(SwapGem)
          .to(
            { x: storeTile1.x, y: storeTile1.y },
            200,
            Phaser.Easing.Linear.In,
            true
          );

        SwapGem = allGems[getGemPos(storeTile2.x)][getGemPos(storeTile2.y)];
        SelectedGem = allGems[getGemPos(storeTile1.x)][getGemPos(storeTile1.y)];

        console.log(
          allGems[getGemPos(SelectedGem.x)][getGemPos(SelectedGem.y)].x,
          allGems[getGemPos(SelectedGem.x)][getGemPos(SelectedGem.y)].y
        );

        console.log(
          allGems[getGemPos(SwapGem.x)][getGemPos(SwapGem.y)].x,
          allGems[getGemPos(SwapGem.x)][getGemPos(SwapGem.y)].y
        );
        //  allGems[getGemPos(SwapGem.x)][getGemPos(SwapGem.y)] = SelectedGem;
        allGems.map(it => it.map(it => console.log(it.x, it.y, it.key)));
        //  SelectedGem = allGems[getGemPos(gem1.x)][getGemPos(gem1.y)];
        // SwapGem = allGems[getGemPos(gem2.x)][getGemPos(gem2.y)];
        return allGems;
      }
    }
  }
};

function getGemPos(coordinate) {
  return Math.floor(coordinate / gemSize);
}

function chooseGem(gem) {
  if (canMove) {
    SelectedGem = gem; // allGems[getGemPos(gem.y) - 1][getGemPos(gem.x)];
    SelectedGem.scale.setTo(1.1);
    console.log(SelectedGem.x, SelectedGem.y, SelectedGem.key);
  }
}

function releaseGem() {
  SelectedGem.scale.setTo(1);
  SelectedGem = null;
  SwapGem = null;
}

function checkMatches() {
  tileUp();
  // let matches = getMatches(allGems);
  /* if (matches.length > 0) {
    removeTileGroup(matches);
    resetTile();
    fillTile();
    tileUp();
  } else {
    swapTiles(SelectedGem, SwapGem);
    tileUp();
    canMove = true;
  } */
}

function tileUp() {
  canMove = true;
}
/*
function getMatches(matrix) {
  let matches = [];
  let group = [];

  matrix.map(
    (it, index) =>
      it
        .filter(
          (it2, index2, arr) =>
            it2.key === arr.filter(it => it2 !== it).map(it => it.key)
        )
        .map(it =>
          console.log(it.x, it.y, it.key)
        ) /*
          .filter(
            (it, index, arr) =>
              Math.abs(it.y - arr.map(it => it.y)) === 1 * gemSize &&
              Math.abs(it.y - arr.map(it => it.y)) == 2 * gemSize
          )
          .map(it5 => console.log(it5.x, it5.y)) 

      // .map((it3, index) => console.log( it3.x, it3.y))
      /* .filter(
          (it2, index2, arr2) =>
            it2.key === arr2[index2+1].key && it2.key === arr2[index2 - 1].key
        ) 
  );
  //console.log(matches);
}

/*
function slideGem(pointer, x, y) {
  if (selectedGem && pointer.isDown) {
    var cursorGemPosX = getGemPos(x);
    var cursorGemPosY = getGemPos(y);
    if (
      checkIfGemCanBeMovedHere(
        selectedGemStartPos.x,
        selectedGemStartPos.y,
        cursorGemPosX,
        cursorGemPosY
      )
    ) {
    }
  }
}

// gems can only be moved 1 square up/down or left/right
function checkIfGemCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY) {
  if (
    toPosX < 0 ||
    toPosX >= BOARD_COLS ||
    toPosY < 0 ||
    toPosY >= BOARD_ROWS
  ) {
    return false;
  }

  if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
    return true;
  }

  if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
    return true;
  }

  return false;
}


*/
