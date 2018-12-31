// models state of the board

const PubSub = require('../helpers/pub_sub');

const Board = function() {

  // pits is numeric array, starts in leftmost pit
  // in bottom row, and goes counter clockise

  this.pits = [4,4,4,4,4,4,4,4,4,4,4,4];
  this.pitMap = {
    '#a' : 0,
    '#b' : 1,
    '#c' : 2,
    '#d' : 3,
    '#e' : 4,
    '#f' : 5,
    '#A' : 6,
    '#B' : 7,
    '#C' : 8,
    '#D' : 9,
    '#E' : 10,
    '#F' : 11
  }
}

Board.prototype.onBoardChange = function () {
  PubSub.publish("board:changed",{
    pits: this.pits,
    pitMap: this.pitMap
  });
};

Board.prototype.bindEvents = function () {
  PubSub.subscribe("oware:boardchange", (detail) => {
    this.onBoardChange();
  })
};

module.exports = Board;
