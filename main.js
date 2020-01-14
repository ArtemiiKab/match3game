window.onload = function main() {
  const game = new Phaser.Game(800, 600, Phaser.AUTO, "", null, true);
  game.state.add("Boot", Game.Boot);
  game.state.add("Preloader", Game.Preloader);
  game.state.add("MainMenu", Game.MainMenu);
  game.state.add("GameLogic", Game.GameLogic);
  game.state.add("EndGame", Game.EndGame);
  game.state.start("Boot");
};
