function getLinearTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return step * index;
}

function getLinearReversedTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return maxTimeMs - (step * Math.floor(index));
}

function getGroupedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 3;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index / 3);
}

function getGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 3;
  let step = Math.floor(maxTimeMs / numSteps);
  return maxTimeMs - (step * Math.floor(index / 3));
}

function getModTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 8;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index % 3);
}

function getModReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 8;
  let step = Math.floor(maxTimeMs / numSteps);
  return maxTimeMs - (step * Math.floor(index % 3));
}

function getTopTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 6;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    1, 0, 1, 1, 0, 1, 1, 0, 1,
    3, 2, 3, 2, 3, 2,
    5, 4, 5, 5, 4, 5, 5, 4, 5
  ];
  return step * indexToSteps[index];
}

function getTopReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 6;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    5, 4, 5, 5, 4, 5, 5, 4, 5,
    2, 3, 2, 3, 2, 3,
    0, 1, 0, 0, 1, 0, 0, 1, 0,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 11;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
          2, 3, 4, 5, 6, 7, 
    0, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 11;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    8, 7, 6, 5, 4, 3, 2, 1, 0,
          6, 5, 4, 3, 2, 1, 
    8, 7, 6, 5, 4, 3, 2, 1, 0,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightGroupedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 5;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 0, 0, 2, 2, 2, 4, 4, 4,
          1, 1, 1, 3, 3, 3,
    0, 0, 0, 2, 2, 2, 4, 4, 4,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 5;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    4, 4, 4, 2, 2, 2, 0, 0, 0,
          3, 3, 3, 1, 1, 1,
    4, 4, 4, 2, 2, 2, 0, 0, 0,
  ];
  return step * indexToSteps[index];
}

function getDiagonalGroupedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 4;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 0, 0, 1, 1, 1, 2, 2, 2,
          1, 1, 1, 2, 2, 2,
    1, 1, 1, 2, 2, 2, 3, 3, 3,
  ];
  return step * indexToSteps[index];
}

function getDiagonalGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 4;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    3, 3, 3, 2, 2, 2, 1, 1, 1,
          2, 2, 2, 1, 1, 1,
    2, 2, 2, 1, 1, 1, 0, 0, 0
  ];
  return step * indexToSteps[index];
}

function getOtherDiagonalGroupedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 4;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    2, 2, 2, 1, 1, 1, 0, 0, 0,
          2, 2, 2, 1, 1, 1,
    3, 3, 3, 2, 2, 2, 1, 1, 1,
  ];
  return step * indexToSteps[index];
}

function getOtherDiagonalGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  let smallIndex = 4;
  let step = Math.floor(maxTimeMs / 4);
  let indexToSteps = [
    1, 1, 1, 2, 2, 2, 3, 3, 3,
          1, 1, 1, 2, 2, 2,
    0, 0, 0, 1, 1, 1, 2, 2, 2,
  ];
  return step * indexToSteps[index];
}

let timeoutFunctions = [
  [getLinearTimeout, getLinearReversedTimeout]
];

let rhombusTimeoutFunctions = [
  [getGroupedTimeout, getGroupedReversedTimeout],
  [getModTimeout, getModReversedTimeout],
  [getTopTimeout, getTopReversedTimeout],
  [getLeftToRightTimeout, getLeftToRightReversedTimeout],
  [getLeftToRightGroupedTimeout, getLeftToRightGroupedReversedTimeout],
  [getDiagonalGroupedTimeout, getDiagonalGroupedReversedTimeout],
  [getOtherDiagonalGroupedTimeout, getOtherDiagonalGroupedReversedTimeout]
];


function getRandomTimeout(maxTimeMs, minTimeMs) {
  return Math.floor(Math.random() * (maxTimeMs - minTimeMs)) + minTimeMs;
}
