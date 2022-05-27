function rhombusPoints(x, y, size) {
  yDelta = Math.floor(Math.cos(Math.PI / 6) * size);
  xDelta = Math.floor(Math.sin(Math.PI / 6) * size);

  p1 = {x: x, y: y};
  p2 = {x: x + xDelta, y: y + yDelta};
  p3 = {x: x, y: y + (yDelta * 2)};
  p4 = {x: x - xDelta, y: y + yDelta};

  return [p1, p2, p3, p4];
}

makeRhombus = function() {
  rhombus = {};
  rhombus.xSize = 334;
  rhombus.sideLength = Math.floor((rhombus.xSize / 2) / Math.cos(Math.PI / 6));
  rhombus.ySize = rhombus.sideLength * 2;
  rhombus.size = 1000;
  rhombus.defaultItems = 24;
  rhombus.closeUpIndexes = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 19];
  rhombus.paging = {"small": 3, "medium": 9, "big": 24};
  rhombus.timeoutFunctions = timeoutFunctions.concat(rhombusTimeoutFunctions);

  let rpoints = rhombusPoints(0, 0, rhombus.sideLength);

  let clipPathLeft = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: -30,
  });
  let clipPathCenter = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: 90,
  });
  let clipPathRight = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: 30,
  });

  let bigRPoints = rhombusPoints(0, 0, rhombus.sideLength * 4);
  let clipPathBig = new fabric.Polygon(bigRPoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: 90,
  });

  rhombus.prepare = function(data) {
    let clipPaths = [clipPathLeft, clipPathCenter, clipPathRight];
    var x = 0;
    var y = 0;
    var isShortRow = false;
    for (var i = 0; i < data.length; i+= 3) { /* warning!  three at a time! */
      if (x >= (rhombus.size) || (isShortRow && x >= (rhombus.size  - rhombus.xSize )) ) {
        if (isShortRow == false) {
          isShortRow = true;
          x = rhombus.xSize / 2;
          y = y + rhombus.ySize * 0.75;
        } else {
          isShortRow = false;
          x = 0;
          y = y + rhombus.ySize * 0.75;
        }
      }
      for (var j = 0; i + j < data.length; j++) { /* warning!  checking the sum! */
        let record = data[i + j];
        if (j == 0) {
          record.x = x - rhombus.xSize * 0.25;
          record.y = y + rhombus.ySize * 0.375;
          record.clipPath = clipPaths[0];
          record.clickX = record.x;
          record.clickY = record.y;
          record.angle = -30;
        } else if (j == 1) {
          record.x = x;
          record.y = y;
          record.clipPath = clipPaths[1];
          record.clickX = record.x + rhombus.xSize;
          record.clickY = record.y;
          record.angle = 90;
        } else if (j == 2 ) {
          record.x = x + rhombus.xSize * 0.25;
          record.y = y + rhombus.ySize * 0.375;
          record.clipPath = clipPaths[2];
          record.clickX = record.x + rhombus.xSize / 2;
          record.clickY = record.y - rhombus.ySize / 4;
          record.angle = 30;
        }
        record.imageX = record.x + (rhombus.xSize / 2);
        record.imageY = record.y + (rhombus.ySize / 4);

        record.bigImageX = rhombus.xSize * (1.5);
        record.bigImageY = rhombus.ySize;
        record.bigClipPath = clipPathBig;

        if (rhombus.closeUpIndexes.includes(i + j)) {
          record.isCloseUp = true;
          record.tempClipPathX = record.x - rhombus.xSize;
          record.tempClipPathY = record.y - (rhombus.ySize * 0.75)
        } else {
          record.isCloseUp = false;
        }
      }

      x = x + rhombus.xSize;
    }

    for (var i = 0; i < data.length; i++) {
      let record = data[i];
      record.index = i;
      record.nextTrackToShow = 0;
      record.isAnimating = false;
      record.imagePath = "images/" + record.id + ".jpg";
      record.smallImagePath = "images/" + record.id + "-small.jpg";
      let directionId = Math.floor(record.id / 100) % 2;
      let timeoutIndex = record.id % rhombus.timeoutFunctions.length;

      if (directionId === 0) {
        record.timeoutFunction = rhombus.timeoutFunctions[timeoutIndex][0];
        record.reverseTimeoutFunction = rhombus.timeoutFunctions[timeoutIndex][1];
      } else {
        record.timeoutFunction = rhombus.timeoutFunctions[timeoutIndex][1];
        record.reverseTimeoutFunction = rhombus.timeoutFunctions[timeoutIndex][0];
      }
      record.timeouts = {
        slow: 750,
        fast: 400,
      }
      uiHelper.setMouseListeners(record, data);
    }
    return data;
  }

  rhombus.render = function(c, data) {
    imageHelper.loadImages(data)
    .then(() => {
      for (let record of data) {
        record.image = tessellationHelper.createAndRenderImage(canvas, record);
        record.clickable = tessellationHelper.createClickableMask(fabric.Polygon, record, rhombus.xSize, rhombus.ySize, rpoints)
        tessellationHelper.createDefaultClickState(c, record, data);
      }
    });
  }

  return rhombus;
}
