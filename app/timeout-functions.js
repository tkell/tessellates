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
  let possibleSteps = [
    [1, 4, 7],
    [0, 2, 3, 5, 6, 8],
    [10, 13],
    [9, 11, 12, 14],
    [16, 19, 22],
    [15, 17, 18, 20, 21, 23],
  ]
  for (var i = 0; i < possibleSteps.length; i++) {
    let indexes = possibleSteps[i];
    if (indexes.includes(index)) {
      return step * i;
    }
  }
}

function getTopReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 6;
  let step = Math.floor(maxTimeMs / 6);
  let possibleSteps = [
    [15, 17, 18, 20, 21, 23],
    [16, 19, 22],
    [9, 11, 12, 14],
    [10, 13],
    [0, 2, 3, 5, 6, 8],
    [1, 4, 7],
  ]
  for (var i = 0; i < possibleSteps.length; i++) {
    let indexes = possibleSteps[i];
    if (indexes.includes(index)) {
      return step * i;
    }
  }
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
