// handles pit display
const PubSub = require('../helpers/pub_sub');

const PitView = function(attachment) {
  this.id = attachment;
  this.element = document.querySelector(attachment);
};

PitView.prototype.bindEvents = function () {

  PubSub.subscribe(`pitView:change--${this.id}`, (event) => {
    // a pit changed (either lost or gained seeds)

    PubSub.signForDelivery(this,event);
    const pitCount = event.detail.count; // e.g. 3
    const pitDiv = this.element;
    pitDiv.innerHTML = '';
    if (pitCount>0) {
      const numberDiv = document.createElement("h1");
      numberDiv.innerHTML = parseInt(pitCount);
      this.element.appendChild(numberDiv);
    };
  });
};

module.exports = PitView;
