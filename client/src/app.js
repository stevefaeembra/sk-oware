const PitView = require("./views/pit-view");
const Oware = require("./models/oware-model");
const PubSub = require('./helpers/pub_sub');
const BoardView = require("./views/board-view");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM has loaded");
  const items = [
    new Oware(),
    new BoardView()
  ];
  items.forEach((item) => {
    item.bindEvents();
  });

  PubSub.publish("oware:newgame", {});

});
