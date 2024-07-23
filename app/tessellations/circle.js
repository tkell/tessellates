makeCircle = function() {
  circle = {};
  circle.itemRadius = 125;
  circle.radius = 375;
  circle.size = 1000;
  circle.defaultItems = 12;
  circle.angleIncrement = 360 / circle.defaultItems;
  circle.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  circle.paging = {"small": 1, "medium": 3, "big": 12};
  circle.timeoutFunctions = timeoutFunctions.concat(squareTimeoutFunctions); // change!
  circle.timeouts = {"slow": 725, "fast": 350};
  circle.fabricKlass = fabric.Circle;
  circle.preloadRadius = 110;

  let circleClipPath = new fabric.Circle({
    originX: 'center',
    originY: 'center',
    radius: circle.itemRadius,
    selectable: false
  });

  let clipPathBig = new fabric.Circle({
    originX: 'center',
    originY: 'center',
    radius: circle.radius * 0.85,
    selectable: false
  });

  circle.prepare = function(data) {
    for (let i = 0; i < data.length; i++) {
      let angle = 0;
      let radians = i * circle.angleIncrement * Math.PI / 180;
      let record = data[i];

      record.x = circle.size / 2 + circle.radius * Math.cos(radians);
      record.y = circle.size / 2 + circle.radius * Math.sin(radians);
      record.itemRadius = circle.itemRadius;

      record.angle = angle;
      record.imageX = record.x;
      record.imageY = record.y;
      record.clickX = record.x - circle.itemRadius;
      record.clickY = record.y - circle.itemRadius;
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
