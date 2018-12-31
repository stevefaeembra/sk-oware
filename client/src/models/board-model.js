// models state of the board

const PubSub = require('../helpers/pub_sub');
const Pause = require("../helpers/sleep");

const Board = function() {

  // pits is numeric array, starts in leftmost pit
  // in bottom row, and goes counter clockise

  this.pits = [4,4,4,4,4,4, 4,4,4,4,4,4];
  this.currentPlayer = 1;
  this.scores = [0,0];
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
    pitMap: this.pitMap,
    currentPlayer: this.currentPlayer,
    scores: this.scores
  });
};

Board.prototype.bindEvents = function () {
  // board has changed
  PubSub.subscribe("oware:boardchange", (detail) => {
    this.onBoardChange();
  });
  // player has switched
  PubSub.subscribe("oware:switchPlayer", (event) => {
    this.currentPlayer = 3 - this.currentPlayer;
    // if player is computer, do computer move
    if (this.currentPlayer==2) {
      this.computerMove();
    }
  })
  // player has clicked on a home row
  PubSub.subscribe("pitView:play", (event) => {
    PubSub.signForDelivery(this, event);
    this.humanMove(event.detail.id);
  });
};

Board.prototype.computerMove = async function () {

  // do computer move.
  // this AI is very simple; just pick a non-empty pit on
  // the computer's home row and sow from there.

  PubSub.publish("message", {message: "I'm thinking..."});
  await Pause(1000);
  let homeRow = ['#a','#b','#c','#d','#e','#f'];
  let possiblePitIds = homeRow.filter((pitID) => {
    return (this.pits[this.pitMap[pitID]] > 0);
  });

  let pitID = possiblePitIds[Math.floor(Math.random()*possiblePitIds.length)];
  let pitCount = this.pits[this.pitMap[pitID]];

  let cursor = this.pitMap[pitID];
  this.pits[cursor] = 0;
  this.onBoardChange();
  PubSub.publish("message", {message: `I'm sowing ${pitCount} seeds from ${pitID}`});
  cursor = (cursor + 1) % 12; // start sowing one pit to right, CCW
  for (var seedsInHand = pitCount; seedsInHand>0 ; seedsInHand-=1) {
    this.pits[cursor] += 1;
    cursor = (cursor + 1) % 12;
    this.onBoardChange();
    await Pause(700); // block for 1/3 second unit next sowing
  };

  // back over to human.

  await Pause(2000);
  PubSub.publish("oware:switchPlayer", {});
};

Board.prototype.humanMove = async function (pitID) {

  // Sow seeds starting in given pit

  const pitCount = this.pits[this.pitMap[pitID]];
  if (pitCount==0) {
    PubSub.publish("message", {message: "You need to click a pit on the bottom row which has seeds in it."})
    return;
  }
  console.log(`Sowing ${pitCount} seeds from ${pitID}`);
  // separate each sowing move by 500ms
  let cursor = this.pitMap[pitID];
  this.pits[cursor] = 0;
  this.onBoardChange();
  PubSub.publish("message", {message: `You're sowing ${pitCount} seeds from ${pitID}`});
  cursor = (cursor + 1) % 12; // start sowing one pit to right, CCW
  for (var seedsInHand = pitCount; seedsInHand>0 ; seedsInHand-=1) {
    this.pits[cursor] += 1;
    cursor = (cursor + 1) % 12;
    this.onBoardChange();
    await Pause(700); // block for 1/3 second unit next sowing
  };

  // did last item equal 2 or 3
  let landedOn = (cursor-1)%12;
  if (this.pits[landedOn]===2 || this.pits[landedOn]===3) {
    //debugger;
    PubSub.publish('message',{message:`You captured!`});
    const capturedPips = this.pits[landedOn];
    this.pits[landedOn] = 0;
    this.scores[0] += capturedPips;
    await Pause(500);
    this.onBoardChange();
  }

  // computer's go!
  PubSub.publish("oware:switchPlayer", {});
};

module.exports = Board;
