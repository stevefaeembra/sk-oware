// sleep function. works like python sleep.
// used to slow down animations so user can see sowing in progess

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pause(ms) {
  await sleep(ms);
  console.log("time passed!");
}

module.exports = pause;
