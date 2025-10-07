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

  square.moveRecord = function(record, newIdex, paginationOffset) {
    const columns = 3
    const itemSizeX = 1000 / columns;
    const itemSizeY = 1000 / columns;

    // Calculate current and new positions in the grid
    const currentIndex = record.index;
    const newRow = Math.floor(newGridIndex / columns);
    const newCol = newGridIndex % columns;
    const currentRow = Math.floor(currentIndex / columns);
    const currentCol = currentIndex % columns;

    let xOffset = (newCol - currentCol) * itemSizeX;
    let yOffset = (newRow - currentRow) * itemSizeY;

    record.imageItem.style.transition = 'transform 725ms ease-in-out, clip-path 500ms ease-in-out';
    record.imageItem.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    record.isAnimating = true;
  }

  return square;
};
