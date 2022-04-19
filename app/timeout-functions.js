function getLinearTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return step * index;
}

function getLinearReversedTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return maxTimeMs - (step * Math.floor(index));
}

function getGroupedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = maxIndex / 3;
  let step = Math.floor(maxTimeMs / smallIndex);
  return step * Math.floor(index / 3);
}

function getGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = maxIndex / 3;
  let step = Math.floor(maxTimeMs / smallIndex);
  return maxTimeMs - (step * Math.floor(index / 3));
}

function getModTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = maxIndex / 8;
  let step = Math.floor(maxTimeMs / smallIndex);
  return step * Math.floor(index % 3);
}

function getModReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = maxIndex / 8;
  let step = Math.floor(maxTimeMs / smallIndex);
  return maxTimeMs - (step * Math.floor(index % 3));
}

timeoutFunctions = [
  [getLinearTimeout, getLinearReversedTimeout],
  [getGroupedTimeout, getGroupedReversedTimeout],
  [getModTimeout, getModReversedTimeout],
];

function getRandomTimeout(maxTimeMs, minTimeMs) {
  return Math.floor(Math.random() * (maxTimeMs - minTimeMs)) + minTimeMs;
}
