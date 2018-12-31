// handles pit display
const PubSub = require('../helpers/pub_sub');

const PitView = function(attachment) {
  this.element = document.querySelector(attachment);
};

PitView.prototype.bindEvents = function () {
  PubSub.subscribe('pitView-change', (detail) => {
  });
};

module.exports = PitView;
