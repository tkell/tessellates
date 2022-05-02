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

// ok, so we need left-to-right, and then maybe one more
// and then do we need grouped here?
function getLeftToRightTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 11;
  let step = Math.floor(maxTimeMs / 11);
  let indexToSteps = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
          2, 3, 4, 5, 6, 7, 
    0, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 11;
  let step = Math.floor(maxTimeMs / 11);
  let indexToSteps = [
    8, 7, 6, 5, 4, 3, 2, 1, 0,
          6, 5, 4, 3, 2, 1, 
    8, 7, 6, 5, 4, 3, 2, 1, 0,
  ];
  return step * indexToSteps[index];
}

timeoutFunctions = [
  [getLinearTimeout, getLinearReversedTimeout],
  [getGroupedTimeout, getGroupedReversedTimeout],
  [getModTimeout, getModReversedTimeout],
  [getTopTimeout, getTopReversedTimeout],
  [getLeftToRightTimeout, getLeftToRightReversedTimeout],
];

function getRandomTimeout(maxTimeMs, minTimeMs) {
  return Math.floor(Math.random() * (maxTimeMs - minTimeMs)) + minTimeMs;
}
