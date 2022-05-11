makeSquare = function() {
  square = {};
  square.xSize = 334;
  square.ySize = 334;
  square.size = 1000;
  square.defaultItems = 9;
  square.closeUpIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  square.paging = {"small": 1, "medium": 3, "big": 9};
  square.timeoutFunctions = timeoutFunctions.concat(squareTimeoutFunctions);

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
    }

    for (var i = 0; i < data.length; i++) {
      let record = data[i];
      record.isAnimating = false;
      record.imagePath = "images/" + record.id + ".jpg";
      record.smallImagePath = "images/" + record.id + "-small.jpg";
      record.isCloseUp = true;
      record.index = i;
      let directionId = Math.floor(record.id / 100) % 2;
      let timeoutIndex = record.id % square.timeoutFunctions.length;

      if (directionId === 0) {
        record.timeoutFunction = square.timeoutFunctions[timeoutIndex][0];
        record.reverseTimeoutFunction = square.timeoutFunctions[timeoutIndex][1];
      } else {
        record.timeoutFunction = square.timeoutFunctions[timeoutIndex][1];
        record.reverseTimeoutFunction = square.timeoutFunctions[timeoutIndex][0];
      }

      record.onMouseOver = function() {
        uiHelper.bounceRecord(record);
        uiHelper.updateTextWithTitle(record, data);
      }
      record.onMouseDown = function() {
        uiHelper.updateTextWithArtistAndTitle(record);
        uiHelper.replaceOtherRecords(record, data, 825)
          .then(() => {
            uiHelper.hideExistingImages(data);
            uiHelper.replaceCloseUpImage(record, data, 625);
          })
          .then(() => uiHelper.waitFor(1500))
          .then(() => uiHelper.displayBigImage(record, data, canvas));
      }
      record.onBigImageClose = function() {
        uiHelper.showExistingImages(data);
        uiHelper.waitFor(1)
          .then(() => uiHelper.removeBigImage(data, canvas))
          .then(() => uiHelper.removeCloseUpImages(record, data, 400))
          .then(() => uiHelper.restoreOtherRecords(record, data, 625))
          .then(() => uiState.bigImage.isShowing = false)
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
