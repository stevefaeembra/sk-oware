// models view of pits as a whole

const PubSub = require('../helpers/pub_sub');
const PitView = require('./pit-view');

const BoardView = function(attachment) {
  this.element = document.querySelector(attachment);
  this.currentPlayer = 1;
  this.pitViews = [
    new PitView('#A'),
    new PitView('#B'),
    new PitView('#C'),
    new PitView('#D'),
    new PitView('#E'),
    new PitView('#F'),
    new PitView('#a'),
    new PitView('#b'),
    new PitView('#c'),
    new PitView('#d'),
    new PitView('#e'),
    new PitView('#f')
  ];
};

BoardView.prototype.updateScores = function (scores) {
  // update scores
  console.log(scores);
  const player1 = scores[0];
  const player2 = scores[1];
  const player1div = document.querySelector('.home#south');
  const player2div = document.querySelector('.home#north');
  player1div.innerHTML = '';
  player2div.innerHTML = '';
  const score1div = document.createElement('div');
  const score2div = document.createElement('div');
  score1div.className="score";
  score2div.className="score";
  score1div.innerHTML = parseInt(player1);
  score2div.innerHTML = parseInt(player2);
  player1div.appendChild(score1div);
  player2div.appendChild(score2div);
};

BoardView.prototype.bindEvents = function () {
  this.pitViews.forEach((pitView) => {
    pitView.bindEvents();
  });

  PubSub.subscribe('board:changed', (event) => {
    const pits = event.detail.pits;
    const pitMap = event.detail.pitMap;
    const scores = event.detail.scores;
    this.updateScores(scores);
    this.currentPlayer = event.detail.currentPlayer;
    this.pitViews.forEach((pitView) => {
      const id = pitView.id;
      const index = pitMap[id];
      const pitCount = pits[index];
      PubSub.publish(`pitView:change--${id}`, {count: pitCount});
    });
  });
};

module.exports = BoardView;
