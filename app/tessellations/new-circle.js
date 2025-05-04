/**
 * New circle tessellation using HTML/CSS instead of fabric.js
 */
makeCircle = function() {
  circle = {};
  circle.xSize = 334;
  circle.ySize = 334;
  circle.xMoveOffset = circle.xSize;
  circle.yMoveOffset = circle.ySize;
  circle.size = 1000;
  circle.defaultItems = 9;
  circle.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  circle.paging = {"small": 1, "medium": 3, "big": 9};
  circle.timeoutFunctions = timeoutFunctions.concat(circleTimeoutFunctions || []);
  circle.timeouts = {"slow": 725, "fast": 350};
  circle.preloadRadius = 110;
  circle.type = 'circle'; // Add type identifier for CSS

  circle.prepare = function(data) {
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

  circle.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, circle, previousData, paginationOffset);
  };

  return circle;
};