/**
 * New rhombus tessellation using HTML/CSS instead of fabric.js
 */
makeRhombus = function() {
  rhombus = {};
  rhombus.xSize = 334;
  rhombus.ySize = 334;
  rhombus.xMoveOffset = rhombus.xSize;
  rhombus.yMoveOffset = rhombus.ySize;
  rhombus.size = 1000;
  rhombus.defaultItems = 9;
  rhombus.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  rhombus.paging = {"small": 1, "medium": 3, "big": 9};
  rhombus.timeoutFunctions = timeoutFunctions.concat(rhombusTimeoutFunctions || []);
  rhombus.timeouts = {"slow": 725, "fast": 350};
  rhombus.preloadRadius = 110;
  rhombus.type = 'rhombus'; // Add type identifier for CSS

  rhombus.prepare = function(data) {
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

  rhombus.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, rhombus, previousData, paginationOffset);
  };

  return rhombus;
};