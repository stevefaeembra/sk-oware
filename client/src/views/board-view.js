// models view of pits as a whole

const PubSub = require('../helpers/pub_sub');
const PitView = require('./pit-view');

const BoardView = function(attachment) {
  this.element = document.querySelector(attachment);
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

BoardView.prototype.bindEvents = function () {
  this.pitViews.forEach((pitView) => {
    pitView.bindEvents();
  });
  PubSub.subscribe('board:changed', (event) => {
    const pits = event.detail.pits;
    const pitMap = event.detail.pitMap;
    this.pitViews.forEach((pitView) => {
      const id = pitView.id;
      const index = pitMap[id];
      const pitCount = pits[index];
      PubSub.publish(`pitView:change--${id}`, {count: pitCount});
    });
  });
};

module.exports = BoardView;
