/**
 * New rhombus tessellation using HTML/CSS instead of fabric.js
 */
makeRhombus = function() {
  rhombus = {};
  rhombus.size = 1000;
  rhombus.defaultItems = 24;
  rhombus.closeUpIndexes = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 19];
  rhombus.paging = {"small": 3, "medium": 9, "big": 24};
  rhombus.timeoutFunctions = timeoutFunctions.concat(rhombusTimeoutFunctions || []);
  rhombus.timeouts = {"slow": 625, "fast": 325};
  rhombus.type = 'rhombus'; // Add type identifier for CSS

  rhombus.prepare = function(data) {
    for (var i = 0; i < data.length; i += 3) { // Process 3 at a time
      for (var j = 0; j < 3 && i + j < data.length; j++) {
        let record = data[i + j];
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

        // Set close-up status
        if (rhombus.closeUpIndexes.includes(i + j)) {
          record.isCloseUp = true;
        } else {
          record.isCloseUp = false;
        }
      }
    }

    return data;
  };

  rhombus.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, rhombus, previousData, paginationOffset);
  };

  return rhombus;
};
