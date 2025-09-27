/**
 * New circle tessellation using HTML/CSS instead of fabric.js
 */
makeCircle = function() {
  circle = {};
  circle.itemRadius = 125;
  circle.radius = 375;
  circle.size = 1000;
  circle.xMoveOffset = 0;
  circle.yMoveOffset = 0;
  circle.defaultItems = 12;
  circle.angleIncrement = 360 / circle.defaultItems;
  circle.angleOffset = Math.floor(Math.random() * circle.defaultItems);
  circle.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  circle.paging = {"small": 1, "medium": 6, "big": 12};
  circle.timeoutFunctions = timeoutFunctions.concat(circleTimeoutFunctions);
  circle.timeouts = {"slow": 600, "fast": 275};
  circle.preloadRadius = 100;
  circle.type = 'circle'; // Add type identifier for CSS

  circle.prepare = function(data) {
    for (let i = 0; i < data.length; i++) {
      let record = data[i];

      // Store index for CSS positioning
      record.index = i;
      record.itemRadius = circle.itemRadius;
      record.angle = 0;

      // Big image positioning (center of container)
      record.bigImageX = circle.size / 2;
      record.bigImageY = circle.size / 2;

      record.isCloseUp = true;
    }

    return data;
  }

  circle.render = function(data, previousData, paginationOffset) {
    renderHelper.render(data, circle, previousData, paginationOffset);
  }

  return circle;
}
