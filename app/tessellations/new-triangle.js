/**
 * New triangle tessellation using HTML/CSS instead of fabric.js
 */
makeTriangle = function() {
  triangle = {};
  triangle.xSize = 200;
  triangle.ySize = 200;
  triangle.xMoveOffset = triangle.xSize / 2;
  triangle.yMoveOffset = triangle.ySize;
  triangle.size = 1000;
  triangle.defaultItems = 45;
  triangle.closeUpIndexes = [
    10, 11, 12, 13, 14, 15, 16,
    19, 20, 21, 22, 23, 24, 25,
    28, 29, 30, 31, 32, 33, 34,
  ];
  triangle.paging = {"small": 1, "medium": 9, "big": 45};
  triangle.timeoutFunctions = timeoutFunctions.concat(triangleTimeoutFunctions || []);
  triangle.timeouts = {"slow": 500, "fast": 225};
  triangle.preloadRadius = 40;
  triangle.type = 'triangle'; // Add type identifier for CSS

  triangle.prepare = function(data) {
    var x = 0;
    var y = 0;
    var angle = 0;
    
    for (let i = 0; i < data.length; i++) {
      let record = data[i];
      record.x = x;
      record.y = y;
      record.angle = angle;
      record.imageX = record.x + (triangle.xSize / 2);
      record.imageY = record.y + (triangle.ySize / 2);
      
      // Move to next position with alternating orientation
      if (angle === 0) {
        x = x + this.xSize / 2;
        angle = 180;
      } else if (angle === 180) {
        x = x + this.xSize / 2;
        angle = 0;
      }
      
      // Set close-up status
      if (triangle.closeUpIndexes.includes(i)) {
        record.isCloseUp = true;
        record.tempClipPathX = record.x - (triangle.xSize * 2);
        record.tempClipPathY = record.y - (triangle.ySize * 2);
      } else {
        record.isCloseUp = false;
      }
      
      // Move to next row when needed
      if (x + this.xSize > this.size) {
        x = 0;
        angle = 0;
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