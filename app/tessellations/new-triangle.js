/**
 * New triangle tessellation using HTML/CSS instead of fabric.js
 */
makeTriangle = function() {
  triangle = {};
  triangle.xSize = 334;
  triangle.ySize = 334;
  triangle.xMoveOffset = triangle.xSize;
  triangle.yMoveOffset = triangle.ySize;
  triangle.size = 1000;
  triangle.defaultItems = 9;
  triangle.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  triangle.paging = {"small": 1, "medium": 3, "big": 9};
  triangle.timeoutFunctions = timeoutFunctions.concat(triangleTimeoutFunctions || []);
  triangle.timeouts = {"slow": 725, "fast": 350};
  triangle.preloadRadius = 110;
  triangle.type = 'triangle'; // Add type identifier for CSS

  triangle.prepare = function(data) {
    var x = 0;
    var y = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.angle = 0;
      record.isCloseUp = true;
      
      // Move to next position
      x = x + this.xSize;
      if (x > this.size) {
        x = 0;
        y = y + this.ySize;
      }
    }

    return data;
  };

  triangle.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, triangle, previousData, paginationOffset);
  };

  return triangle;
};