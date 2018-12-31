// models state of the board

const PubSub = require('../helpers/pub_sub');
const Pause = require("../helpers/sleep");

const Board = function() {

  // pits is numeric array, starts in leftmost pit
  // in bottom row, and goes counter clockise

  this.pits = [4,4,4,4,4,4, 4,4,4,4,4,4];
  this.pitMap = {

    // home row
    '#A' : 0,
    '#B' : 1,
    '#C' : 2,
    '#D' : 3,
    '#E' : 4,
    '#F' : 5,

    // computer (north) home row
    '#a' : 6,
    '#b' : 7,
    '#c' : 8,
    '#d' : 9,
    '#e' : 10,
    '#f' : 11,

  }
}

Board.prototype.onBoardChange = function () {
  PubSub.publish("board:changed",{
    pits: this.pits,
    pitMap: this.pitMap
  });
};

Board.prototype.bindEvents = function () {
  // board has changed
  PubSub.subscribe("oware:boardchange", (detail) => {
    this.onBoardChange();
  });
  // player has clicked on a home row
  PubSub.subscribe("pitView:play", (event) => {
    PubSub.signForDelivery(this, event);
    this.humanMove(event.detail.id);
  });
};

Board.prototype.humanMove = async function (pitID) {

  // Sow seeds starting in given pit

  const pitCount = this.pits[this.pitMap[pitID]];
  console.log(`Sowing ${pitCount} seeds from ${pitID}`);
  // separate each sowing move by 500ms
  let cursor = this.pitMap[pitID];
  this.pits[cursor] = 0;
  this.onBoardChange();
  cursor = (cursor + 1) % 12; // start sowing one pit to right, CCW
  for (var seedsInHand = pitCount; seedsInHand>0 ; seedsInHand-=1) {
    this.pits[cursor] += 1;
    cursor = (cursor + 1) % 12;
    this.onBoardChange();
    await Pause(500); // block for 1/2 second unit next sowing
  }
};

module.exports = Board;
