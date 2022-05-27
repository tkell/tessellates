let tessellationHelper = {};

tessellationHelper.render = function(canvas, data, tessellation) {
  for (var i = 0; i < data.length; i++) {
    let record = data[i];
    tessellationHelper.addStartingStateToRecord(record, i, tessellation);
    uiHelper.setMouseListeners(record, data, tessellation);
  }
  imageHelper.loadImages(data)
  .then(() => {
    for (var i = 0; i < data.length; i++) {
      let record = data[i];
      record.image = tessellationHelper.createAndRenderImage(canvas, record);
      record.clickable = tessellationHelper.createClickableMask(record, tessellation)
      tessellationHelper.createDefaultClickState(canvas, record, data);
    }
  });
}

tessellationHelper.addStartingStateToRecord = function(record, index, tessellation) {
  record.index = index;
  record.nextTrackToShow = 0;
  record.isAnimating = false;
  record.imagePath = "images/" + record.id + ".jpg";
  record.smallImagePath = "images/" + record.id + "-small.jpg";

  let directionId = Math.floor(record.id / 100) % 2;
  let timeoutIndex = record.id % tessellation.timeoutFunctions.length;
  if (directionId === 0) {
    record.timeoutFunction = tessellation.timeoutFunctions[timeoutIndex][0];
    record.reverseTimeoutFunction = tessellation.timeoutFunctions[timeoutIndex][1];
  } else {
    record.timeoutFunction = tessellation.timeoutFunctions[timeoutIndex][1];
    record.reverseTimeoutFunction = tessellation.timeoutFunctions[timeoutIndex][0];
  }
}

tessellationHelper.createAndRenderImage = function(canvas, record) {
  record.image.left = record.imageX - (record.image.width / 2);
  record.image.top = record.imageY - (record.image.height / 2);
  record.image.selectable = false;
  record.image.clipPath = record.clipPath;
  canvas.add(record.image);
  canvas.sendToBack(record.image);
  return record.image;
}

tessellationHelper.createClickableMask = function(record, tessellation) {
  let fabricKlass = tessellation.fabricKlass;
  let width = tessellation.xSize;
  let height = tessellation.ySize;
  let polygonPoints = tessellation.polygonPoints;

  let params = {
      left: record.clickX,
      top: record.clickY,
      angle: record.angle,
      perPixelTargetFind: true,
      fill: 'white',
      opacity: 0.001,
      width: width,
      height: height,
      selectable: false
  }

  if (!polygonPoints) {
    return new fabricKlass(params);
  } else {
    return new fabricKlass(polygonPoints, params);
  }
}

tessellationHelper.createDefaultClickState = function(canvas, record, data) {
  let objectToClick = record.clickable;
  let matchingImg = record.image;
  objectToClick.on('mouseover', record.onMouseOver);
  objectToClick.on('mousedown', record.onMouseDown);

  canvas.add(objectToClick);
  canvas.bringToFront(objectToClick);
}
