// this module contains the game logic
const Board = require('./board-model');
const PubSub = require('../helpers/pub_sub');

const Oware = function() {
  this.board = new Board();
};

Oware.prototype.newGame = function () {
  this.board = new Board();
  PubSub.publish("oware:boardchange",{});
};

Oware.prototype.bindEvents = function () {
  PubSub.subscribe("oware:newgame", (detail) => {
    PubSub.signForDelivery(this,event);
    this.newGame();
  });
  this.board.bindEvents();
};

module.exports = Oware;
