function getLinearTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return step * index;
}

function getLinearReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getLinearTimeout(index, maxIndex, maxTimeMs);
}

function getGroupedTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 3;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index / 3);
}

function getGroupedReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getGroupedTimeout(index, maxIndex, maxTimeMs)
}

function getModTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 8;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index % 3);
}

function getModReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getModTimeout(index, maxIndex, maxTimeMs);
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
  return maxTimeMs - getTopTimeout(index, maxIndex, maxTimeMs);
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
  return maxTimeMS - getLeftToRightTimeout(index, maxIndex, maxTimeMs);
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
  return maxTimeMs - getLeftToRightGroupedTimeout(index, maxIndex, maxTimeMs);
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
  return maxTimeMs - getDiagonalGroupedTimeout(index, maxIndex, maxTimeMs);
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
  return maxTimeMs - getOtherDiagonalGroupedTimeout(index, maxIndex, maxTimeMs);
}

function getLeftToRightSquareTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 3;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 1, 2,
    0, 1, 2,
    0, 1, 2,
  ];
  return step * indexToSteps[index];
}

function getLeftToRightSquareReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getLeftToRightSquareTimeout(index, maxIndex, maxTimeMs)
} 

function getDiagonalGroupedSquareTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 5;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    2, 3, 4,
    1, 2, 3,
    0, 1, 2,
  ];
  return step * indexToSteps[index];
}

function getDiagonalGroupedSquareReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getDiagonalGroupedSquareTimeout(index, maxIndex, maxTimeMs);
}

function getOtherDiagonalGroupedSquareTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 5;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 1, 2,
    1, 2, 3,
    2, 3, 4,
  ];
  return step * indexToSteps[index];
}

function getOtherDiagonalGroupedSquareReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getOtherDiagonalGroupedSquareTimeout(index, maxIndex, maxTimeMs);
}

function getClockwiseSquareTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 9;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    0, 1, 2,
    7, 8, 3,
    6, 5, 4,
  ];
  return step * indexToSteps[index];
}

function getClockwiseSquareReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getClockwiseSquareTimeout(index, maxIndex, maxTimeMs);
}

function getCounterClockwiseSquareTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = 9;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    2, 1, 0,
    3, 8, 7,
    4, 5, 6,
  ];
  return step * indexToSteps[index];
}

function getCounterClockwiseSquareReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getCounterClockwiseSquareTimeout(index, maxIndex, maxTimeMs);
}

function getModTriangleTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 9;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index % 5);
}

function getModTriangleReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getModTriangleTimeout(index, maxIndex, maxTimeMs);
}

function getLeftToRightTriangleTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 5;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index % 9);
}

function getLeftToRightTriangleReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getLeftToRightTriangleTimeout(index, maxIndex, maxTimeMs);
}

function getTopToBottomTriangleTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 9;
  let step = Math.floor(maxTimeMs / numSteps);
  return step * Math.floor(index / 9);
}

function getTopToBottomTriangleReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getTopToBottomTriangleTimeout(index, maxIndex, maxTimeMs);
}

function getOutFromMiddleTriangleTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 3;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [
    2,
    1,
    0,
    1,
    2,
  ];
  return step * indexToSteps[Math.floor(index / 9)];
}

function getOutFromMiddleTriangleReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getOutFromMiddleTriangleTimeout(index, maxIndex, maxTimeMs);
}

function getOutFromCenterTriangleTimeout(index, maxIndex, maxTimeMs) {
  let numSteps = maxIndex / 5;
  let step = Math.floor(maxTimeMs / numSteps);
  let indexToSteps = [4, 3, 2, 1, 0, 1, 2, 3, 4];
  return step * indexToSteps[Math.floor(index % 9)];
}

function getOutFromCenterTriangleReversedTimeout(index, maxIndex, maxTimeMs) {
  return maxTimeMs - getOutFromCenterTriangleTimeout(index, maxIndex, maxTimeMs);
}

let timeoutFunctions = [
  [getLinearTimeout, getLinearReversedTimeout]
];

let squareTimeoutFunctions = [
  [getGroupedTimeout, getGroupedReversedTimeout],
  [getLeftToRightSquareTimeout, getLeftToRightSquareReversedTimeout],
  [getDiagonalGroupedSquareTimeout, getDiagonalGroupedSquareReversedTimeout],
  [getOtherDiagonalGroupedSquareTimeout, getOtherDiagonalGroupedSquareReversedTimeout],
  [getClockwiseSquareTimeout, getClockwiseSquareReversedTimeout],
  [getCounterClockwiseSquareTimeout, getCounterClockwiseSquareReversedTimeout],
];

let triangleTimeoutFunctions = [
  [getModTriangleTimeout, getModTriangleReversedTimeout],
  [getLeftToRightTriangleTimeout, getLeftToRightTriangleReversedTimeout],
  [getTopToBottomTriangleTimeout, getTopToBottomTriangleReversedTimeout],
  [getOutFromMiddleTriangleTimeout, getOutFromMiddleTriangleReversedTimeout],
  [getOutFromCenterTriangleTimeout, getOutFromCenterTriangleReversedTimeout],
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
