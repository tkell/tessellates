/**
 * New rhombus tessellation using HTML/CSS instead of fabric.js
 */
makeRhombus = function() {
  rhombus = {};
  rhombus.xSize = 334;
  rhombus.sideLength = Math.floor((rhombus.xSize / 2) / Math.cos(Math.PI / 6));
  rhombus.ySize = rhombus.sideLength * 2;
  rhombus.xMoveOffset = rhombus.xSize;
  rhombus.yMoveOffset = rhombus.ySize / 2;
  rhombus.size = 1000;
  rhombus.defaultItems = 24;
  rhombus.closeUpIndexes = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 19];
  rhombus.paging = {"small": 3, "medium": 9, "big": 24};
  rhombus.timeoutFunctions = timeoutFunctions.concat(rhombusTimeoutFunctions || []);
  rhombus.timeouts = {"slow": 625, "fast": 325};
  rhombus.preloadRadius = 75;
  rhombus.type = 'rhombus'; // Add type identifier for CSS

  rhombus.prepare = function(data) {
    var x = 0;
    var y = 0;
    var isShortRow = false;
    
    for (var i = 0; i < data.length; i += 3) { // Process 3 at a time
      // Check if we need to move to next row
      if (x >= rhombus.size || (isShortRow && x >= rhombus.size - rhombus.xSize)) {
        if (!isShortRow) {
          isShortRow = true;
          x = rhombus.xSize / 2; // Offset row
          y = y + rhombus.ySize * 0.75;
        } else {
          isShortRow = false;
          x = 0; // Regular row
          y = y + rhombus.ySize * 0.75;
        }
      }
      
      // Process triplet of rhombuses
      for (var j = 0; j < 3 && i + j < data.length; j++) {
        let record = data[i + j];
        record.rowType = isShortRow ? 'offset' : 'regular';
        record.tripletPosition = j; // 0=left, 1=center, 2=right
        
        if (j === 0) {
          // Left rhombus
          record.angle = -30;
          record.rhombusType = 'left';
        } else if (j === 1) {
          // Center rhombus
          record.angle = 90;
          record.rhombusType = 'center';
        } else if (j === 2) {
          // Right rhombus
          record.angle = 30;
          record.rhombusType = 'right';
        }
        
        // Store base position for CSS grid
        record.gridColumn = Math.floor(i / 3);
        record.gridRow = Math.floor(y / (rhombus.ySize * 0.75));
        
        // Set close-up status
        if (rhombus.closeUpIndexes.includes(i + j)) {
          record.isCloseUp = true;
        } else {
          record.isCloseUp = false;
        }
      }
      
      x = x + rhombus.xSize;
    }

    return data;
  };

  rhombus.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, rhombus, previousData, paginationOffset);
  };

  return rhombus;
};