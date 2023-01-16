let renderHelper = {};

renderHelper.render = function(canvas, data, tessellation) {
  for (var i = 0; i < data.length; i++) {
    let record = data[i];
    renderHelper._addStartingStateToRecord(record, i, tessellation);
    renderHelper._setMouseListeners(record, data, tessellation);
  }

  renderHelper._preload(canvas, data, tessellation)
    .then(() => imageHelper.loadImages(data))
    .then(() => renderHelper._createImages(canvas, data, tessellation));
}

// "Private" methods from here:

renderHelper._addStartingStateToRecord = function(record, index, tessellation) {
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

renderHelper._setMouseListeners = function(record, data, tessellation) {
  record.onMouseOver = function() {
    uiHelper.bounceRecord(record);
    uiHelper.updateTextWithTitle(record);
  }

  record.onMouseDown = function() {
    uiState.bigImage.isShowing = true;
    uiState.bigImage.isAnimating = true;
    uiHelper.updateTextWithArtistAndTitle(record);

    const loadMainImageEarly = fabricImageLoad(record.imagePath);
    const replaceOtherRecordsPromise = uiHelper.replaceOtherRecords(record, data, tessellation.timeouts.slow)
    Promise.all([loadMainImageEarly, replaceOtherRecordsPromise])
      .then(() => {
        uiHelper.hideExistingImages(data);
        return uiHelper.replaceCloseUpImage(record, data, tessellation.timeouts.slow);
      })
      .then(() => uiHelper.waitFor(tessellation.timeouts.slow))
      .then(() => uiHelper.displayBigImage(record, data, canvas))
      .then(() => {
        uiHelper.removeCloseUpImages(record, data, 1);
        record.bigImage.on('mousedown', record.onBigImageClose);
        record.bigImage.on('mouseover', function() {
          uiHelper.updateTextWithTrack(record);
          uiHelper.bounceBigImage();
        });
        uiState.bigImage.isAnimating = false;
        return record.bigImage;
      });
    }

    record.onBigImageClose = function() {
      uiState.bigImage.isAnimating = true;
      uiHelper.showExistingImages(data);
      uiHelper.waitFor(1)
        .then(() => uiHelper.replaceCloseUpImage(record, data, 1))
        .then(() => uiHelper.removeBigImage(data, canvas))
        .then(() => uiHelper.removeCloseUpImages(record, data, tessellation.timeouts.fast))
        .then(() => uiHelper.restoreOtherRecords(record, data, tessellation.timeouts.slow))
        .then(() => {
          uiState.bigImage.isShowing = false;
          uiState.bigImage.isAnimating = false;
          record.nextTrackToShow = 0;
          uiHelper.clearTrack();
        });
    }
}

renderHelper._preload = function(canvas, data, tessellation) {
  let preloadColorPromises = [];
  if (!tessellation.hasPreloaded) {
    for (var i = 0; i < data.length; i++) {
      let record = data[i];
        p = new Promise(function (resolve, reject) {
          setTimeout(() => {
            let radius = tessellation.preloadRadius;
            let circle = new fabric.Circle({radius: radius, left: record.imageX - radius, top: record.imageY - radius});
            let gradient = new fabric.Gradient({
              type: 'linear',
              gradientUnits: 'pixels',
              coords: { x1: 0, y1: 0, x2: 0, y2: circle.height },
              colorStops:[
                { offset: 0, color: record.colors[0] },
                { offset: 1, color: record.colors[1]}
              ]
            });
            circle.set('fill', gradient)
            canvas.add(circle);
            record.preloadObject = circle;
            resolve();
          }, tessellation.timeouts["veryFast"] * i);
        });
        preloadColorPromises.push(p);
      }
    tessellation.hasPreloaded = true;
  }

  return Promise.all(preloadColorPromises);
}

renderHelper._createImages = function(canvas, data, tessellation) {
  for (var i = 0; i < data.length; i++) {
    let record = data[i];
    setTimeout(() => {
      canvas.remove(record.preloadObject);
      record.image = renderHelper._createAndRenderImage(canvas, record);
      record.clickable = renderHelper._createClickableMask(record, tessellation)
      renderHelper._createDefaultClickState(canvas, record, data);
    }, i * tessellation.timeouts["veryFast"]);
  }
}

renderHelper._createAndRenderImage = function(canvas, record) {
  record.image.left = record.imageX - (record.image.width / 2);
  record.image.top = record.imageY - (record.image.height / 2);
  record.image.selectable = false;
  record.image.clipPath = record.clipPath;
  canvas.add(record.image);
  canvas.sendToBack(record.image);
  return record.image;
}

renderHelper._createClickableMask = function(record, tessellation) {
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

renderHelper._createDefaultClickState = function(canvas, record, data) {
  let objectToClick = record.clickable;
  let matchingImg = record.image;
  objectToClick.on('mouseover', record.onMouseOver);
  objectToClick.on('mousedown', record.onMouseDown);

  canvas.add(objectToClick);
  canvas.bringToFront(objectToClick);
}
