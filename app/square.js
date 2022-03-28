makeSquare = function() {
  square = {};
  square.xSize = 334;
  square.ySize = 334;
  square.size = 1000;
  square.defaultItems = 9;
  square.paging = {"small": 1, "medium": 3, "big": 9};
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
      record.isAnimating = false;
      record.imagePath = "images/" + record.id + ".jpg";
      x = x + this.xSize;
      if (x > this.size) {
        x = 0;
        y = y + this.ySize;
      }
    }
    return data;
  }
  
  square.render = function(c, data) {
    imageHelper.loadImages(data)
    .then(() => {
      for (let record of data) {
        record.image = tessellationHelper.createAndRenderImage(canvas, record);
      }
      for (let record of data) {
        record.clickable = tessellationHelper.createClickableMask(fabric.Rect, record, square.xSize, square.ySize)
      }
      for (let record of data) {
        tessellationHelper.createDefaultClickState(c, record, data);
      }
    });
  }

  return square;
}
