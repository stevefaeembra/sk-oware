const PitView = require("./views/pit-view");
const Oware = require("./models/oware-model");
const PubSub = require('./helpers/pub_sub');
const BoardView = require("./views/board-view");
const MessageView = require("./views/message-view");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM has loaded");
  const items = [
    new Oware(),
    new BoardView(".board"),
    new MessageView("#message")
  ];
  items.forEach((item) => {
    item.bindEvents();
  });

  PubSub.publish("oware:newgame", {});

});
