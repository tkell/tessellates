makeSquare = function() {
  square = {};
  square.xSize = 334;
  square.ySize = 334;
  square.xMoveOffset = square.xSize;
  square.yMoveOffset = square.ySize;
  square.size = 1000;
  square.defaultItems = 9;
  square.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  square.paging = {"small": 1, "medium": 3, "big": 9};
  square.timeoutFunctions = timeoutFunctions.concat(squareTimeoutFunctions);
  square.timeouts = {"slow": 725, "fast": 350};
  square.fabricKlass = fabric.Rect;
  square.preloadRadius = 110;

  let squareClipPath = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: square.xSize,
    height: square.ySize,
    selectable: false,
  });

  let clipPathBig = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: square.xSize * 2.5,
    height: square.ySize * 2.5,
    selectable: false,
  });
  
  square.prepare = function(data) {
    var x = 0;
    var y = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.angle = 0;
      record.imageX = record.x + (square.xSize / 2);
      record.imageY = record.y + (square.ySize / 2);
      record.clickX = x;
      record.clickY = y;
      record.clipPath = squareClipPath;
      record.bigClipPath = clipPathBig;
      record.bigImageX = square.xSize * 1.5;
      record.bigImageY = square.ySize * 1.5;
      record.tempClipPathX = record.x - square.xSize;
      record.tempClipPathY = record.y - (square.ySize * 0.75)

      x = x + this.xSize;
      if (x > this.size) {
        x = 0;
        y = y + this.ySize;
      }
      record.isCloseUp = true;
    }

    return data;
  }

  square.render = function(c, data, previousData, paginationOffset) {
    renderHelper.render(c, data, square, previousData, paginationOffset);
  }

  return square;
}
