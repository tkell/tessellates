/**
 * New square tessellation using HTML/CSS instead of fabric.js
 */
makeSquare = function() {
  square = {};
  square.size = 1000;
  square.defaultItems = 9;
  square.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  square.paging = {"small": 1, "medium": 3, "big": 9};
  square.timeoutFunctions = timeoutFunctions.concat(squareTimeoutFunctions);
  square.timeouts = {"slow": 725, "fast": 350};
  square.type = 'square'; // Add type identifier for CSS

  square.prepare = function(data) {
    for (let record of data) {
      record.angle = 0;
      record.isCloseUp = true;
    }

    return data;
  };

  square.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, square, previousData, paginationOffset);
  };

  return square;
};
