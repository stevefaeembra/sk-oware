const PitView = require("./views/pit-view");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM has loaded");
  const items = [
    new PitView('#a'),
    new PitView('#b'),
    new PitView('#c'),
    new PitView('#d'),
    new PitView('#e'),
    new PitView('#f'),
    new PitView('#A'),
    new PitView('#B'),
    new PitView('#C'),
    new PitView('#D'),
    new PitView('#E'),
    new PitView('#F')
  ];
  debugger;
  items.forEach((item) => {
    item.bindEvents();
  })
});
