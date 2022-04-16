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
      record.onMouseOver = function() {
        uiHelper.bounceRecord(record);
        uiHelper.updateTextWithTitle(record, data);
      }
      record.onMouseDown = function() {
        uiHelper.updateTextWithArtistAndTitle(record);
        uiHelper.replaceOtherRecords(record, data, 250, 625)
          .then(() => {
            uiHelper.hideExistingImages(data);
            uiHelper.replaceCloseUpImage(record, data, 125, 625);
          })
          .then(() => uiHelper.waitFor(1250))
          .then(() => uiHelper.displayBigImage(record, data, canvas));
      }

      record.onBigImageClose = function() {
        uiHelper.showExistingImages(data);
        uiHelper.replaceCloseUpImage(record, data, 50, 250)
          .then(() => uiHelper.removeBigImage(data, canvas))
          .then(() => uiHelper.restoreOtherRecords(100, 300));
      }

      record.isAnimating = false;
      record.imagePath = "images/" + record.id + ".jpg";
      record.x = x;
      record.y = y;
      record.angle = angle;
      record.imageX = record.x + (triangle.xSize / 2);
      record.imageY = record.y + (triangle.ySize / 2);
      if (record.angle == 180) {
          record.clipPath = triangleClipPathDown;
          record.clickX = record.x + triangle.xSize;
          record.clickY = record.y + triangle.ySize;
      } else {
          record.clipPath = triangleClipPathUp;
          record.clickX = record.x;
          record.clickY = record.y;
      }

      record.bigClipPath = clipPathBig;
      record.bigImageX = triangle.xSize * 2.5;
      record.bigImageY = triangle.ySize * 2.5;

      if (angle === 0) {
        x = x + this.xSize / 2;
        angle = 180;
      } else if (angle === 180) {
        x = x + this.xSize / 2;
        angle = 0
      }
      if (x + (this.xSize) > this.size) {
        x = 0;
        angle = 0;
        y = y + this.ySize;
      }

      if (triangle.closeUpIndexes.includes(i)) {
        record.isCloseUp = true;
        record.tempClipPathX = record.x - (triangle.xSize * 2);
        record.tempClipPathY = record.y - (triangle.ySize * 2);
      } else {
        record.isCloseUp = false;
      }

    }
    return data;
  }
  
  triangle.render = function(c, data) {
    imageHelper.loadImages(data)
    .then(() => {
      for (let record of data) {
        record.image = tessellationHelper.createAndRenderImage(canvas, record);
      }
      for (let record of data) {
        record.clickable = tessellationHelper.createClickableMask(fabric.Triangle, record, triangle.xSize, triangle.ySize)
      }
      for (let record of data) {
        tessellationHelper.createDefaultClickState(c, record, data);
      }
    });
  }

  return triangle;
}
