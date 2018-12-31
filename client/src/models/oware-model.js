// this module contains the overriding game logic
// most of the game logic is in boardModel.

const Board = require('./board-model');
const PubSub = require('../helpers/pub_sub');

const Oware = function() {
  this.board = new Board();
  this.playerUp = 1; // 1 is human, 2 is computer
};

Oware.prototype.newGame = function () {
  this.board = new Board();
  PubSub.publish("oware:boardchange",{});
};

Oware.prototype.switchPlayer = function () {
  this.playerUp = 3 - this.playerUp; // swap between 1 and 2
  if (this.playerUp == 1) {
    PubSub.publish("message", {message: "Your turn!"});
  } else {
    PubSub.publish("message", {message: "My turn!"});
  }
};

Oware.prototype.bindEvents = function () {
  PubSub.subscribe("oware:newgame", (event) => {
    PubSub.signForDelivery(this,event);
    this.newGame();
    PubSub.publish("message", {message: "Your turn!"});
  });
  PubSub.subscribe("oware:switchPlayer", (event) => {
    this.switchPlayer();
  })
  this.board.bindEvents();
};

module.exports = Oware;
