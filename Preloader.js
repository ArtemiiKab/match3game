Game.Preloader = function(game) {};

Game.Preloader.prototype = {
  preload: function() {
    //ALL ASSETS HERE
    //Menu
    this.load.image("logo", "./images/donuts_logo.png");
    this.load.image("btn-play", "./images/btn-play.png");
    this.load.image("btn-sfx", "./images/btn-sfx.png");
    this.load.image("bg-score", "./images/bg-score.png");
    this.load.image("big-shadow", "./images/big-shadow.png");
    this.load.image("donut", "./images/donut.png");
    this.load.image("timeup", "./images/text-timeup.png");
    this.load.image("background", "./images/backgrounds/background.jpg");
    this.load.image("pointer", "./images/game/hand.png");
    //GEMS
    this.load.image("gem-01", "./images/game/gem-01.png");
    this.load.image("gem-02", "./images/game/gem-02.png");
    this.load.image("gem-03", "./images/game/gem-03.png");
    this.load.image("gem-04", "./images/game/gem-04.png");
    this.load.image("gem-05", "./images/game/gem-05.png");
    this.load.image("gem-06", "./images/game/gem-06.png");
    this.load.image("gem-07", "./images/game/gem-07.png");

    //Partical
    this.load.image("particlegem-01", "./images/particles/particle-1.png");
    this.load.image("particlegem-02", "./images/particles/particle-2.png");
    this.load.image("particlegem-03", "./images/particles/particle-3.png");
    this.load.image("particlegem-04", "./images/particles/particle-4.png");
    this.load.image("particlegem-05", "./images/particles/particle-5.png");
    this.load.image("particlegem-06", "./images/particles/particle-1.png");

    this.load.audio("mainMusic", "./audio/background.mp3");
    this.load.audio("kill", "./audio/kill.mp3");
    this.load.audio("selectSound", "./audio/select-1.mp3");
  },

  create: function() {
    this.state.start("MainMenu");
  }
};
