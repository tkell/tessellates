makeTriangle = function () {
  triangle = {};
  triangle.xSize = 200;
  triangle.ySize = 200;
  triangle.size = 1000;
  triangle.defaultItems = 45;
  triangle.closeUpIndexes = [
    10, 11, 12, 13, 14, 15, 16,
    19, 20, 21, 22, 23, 24, 25,
    28, 29, 30, 31, 32, 33, 34,
  ];
  triangle.paging = {"small": 1, "medium": 9, "big": 45};
  triangle.timeoutFunctions = timeoutFunctions.concat(triangleTimeoutFunctions);
  triangle.timeouts = {"slow": 500, "fast": 225, "veryFast": 18};
  triangle.fabricKlass = fabric.Triangle;

  let triangleClipPathUp = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize,
    height: triangle.ySize,
    angle: 0,
    selectable: false
  });

  let triangleClipPathDown = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize,
    height: triangle.ySize,
    angle: 180,
    selectable: false
  });

  let clipPathBig = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize * 3.5,
    height: triangle.ySize * 3.5,
    selectable: false,
  });
  
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
      record.bigClipPath = clipPathBig;
      record.bigImageX = triangle.xSize * 2.5;
      record.bigImageY = triangle.ySize * 2.5;

      if (record.angle == 180) {
          record.clipPath = triangleClipPathDown;
          record.clickX = record.x + triangle.xSize;
          record.clickY = record.y + triangle.ySize;
      } else {
          record.clipPath = triangleClipPathUp;
          record.clickX = record.x;
          record.clickY = record.y;
      }
      if (angle === 0) {
        x = x + this.xSize / 2;
        angle = 180;
      } else if (angle === 180) {
        x = x + this.xSize / 2;
        angle = 0
      }

      if (triangle.closeUpIndexes.includes(i)) {
        record.isCloseUp = true;
        record.tempClipPathX = record.x - (triangle.xSize * 2);
        record.tempClipPathY = record.y - (triangle.ySize * 2);
      } else {
        record.isCloseUp = false;
      }

      if (x + (this.xSize) > this.size) {
        x = 0;
        angle = 0;
        y = y + this.ySize;
      }
    }

    return data;
  }

  triangle.render = function(c, data) {
    renderHelper.render(canvas, data, triangle);
  }

  return triangle;
}
