makeCircle = function() {
  circle = {};
  circle.itemRadius = 150;
  circle.radius = 350;
  circle.size = 1000;
  circle.defaultItems = 12;
  circle.angleIncrement = 360 / circle.defaultItems;
  circle.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  circle.paging = {"small": 1, "medium": 3, "big": 12};
  circle.timeoutFunctions = timeoutFunctions.concat(squareTimeoutFunctions); // change!
  circle.timeouts = {"slow": 725, "fast": 350};
  circle.fabricKlass = fabric.Circle;
  circle.preloadRadius = 110;

  // Create a circle clip path for each item
  let circleClipPath = new fabric.Circle({
    originX: 'center',
    originY: 'center',
    radius: circle.itemRadius,
    selectable: false
  });

  // Create a larger circle for the close-up view
  let clipPathBig = new fabric.Circle({
    radius: circle.itemRadius * 2,
    originX: 'center',
    originY: 'center',
    radius: circle.itemRadius * 2,
    selectable: false
  });

  circle.prepare = function(data) {
    for (let i = 0; i < data.length; i++) {
      let angle = i * circle.angleIncrement; // Calculate angle for each item
      let radians = angle * Math.PI / 180; // Convert angle to radians
      let record = data[i];

      // Calculate position on the circle
      record.x = circle.size / 2 + circle.radius * Math.cos(radians);
      record.y = circle.size / 2 + circle.radius * Math.sin(radians);

      // Additional properties for each item
      record.angle = angle;
      record.imageX = record.x;
      record.imageY = record.y;
      record.clickX = record.x;
      record.clickY = record.y;
      record.clipPath = circleClipPath;
      record.bigClipPath = clipPathBig;
      record.bigImageX = circle.size / 2;
      record.bigImageY = circle.size / 2;
      record.tempClipPathX = record.x - circle.radius;
      record.tempClipPathY = record.y - (circle.radius * 0.75)

      record.isCloseUp = true;
    }

    return data;
  }

  circle.render = function(c, data, previousData, paginationOffset) {
    renderHelper.render(c, data, circle, previousData, paginationOffset);
  }

  return circle;
}
