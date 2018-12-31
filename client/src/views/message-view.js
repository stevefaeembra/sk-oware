const PubSub = require('../helpers/pub_sub');

// handles the message area at the top
// used for telling user what's going on.

const MessageView = function(attachment) {
  this.element = document.querySelector(attachment);
}

MessageView.prototype.bindEvents = function () {
  PubSub.subscribe("message", (event) => {
    const message = event.detail.message;
    this.element.innerHTML = message;
  })
};

module.exports = MessageView;
