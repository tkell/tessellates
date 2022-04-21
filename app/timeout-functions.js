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

function getTopTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 6;
  let step = Math.floor(maxTimeMs / 6);
  let indexToSteps = [
    1, 0, 1, 1, 0, 1, 1, 0, 1,
    3, 2, 3, 2, 3, 2,
    5, 4, 5, 5, 4, 5, 5, 4, 5
  ];
  return step * indexToSteps[index];
}

function getTopReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 6;
  let step = Math.floor(maxTimeMs / 6);
  let indexToSteps = [
    5, 4, 5, 5, 4, 5, 5, 4, 5,
    2, 3, 2, 3, 2, 3,
    0, 1, 0, 0, 1, 0, 0, 1, 0,
  ];
  return step * indexToSteps[index];
}

timeoutFunctions = [
  [getLinearTimeout, getLinearReversedTimeout],
  [getGroupedTimeout, getGroupedReversedTimeout],
  [getModTimeout, getModReversedTimeout],
  [getTopTimeout, getTopReversedTimeout],
];

function getRandomTimeout(maxTimeMs, minTimeMs) {
  return Math.floor(Math.random() * (maxTimeMs - minTimeMs)) + minTimeMs;
}
