let renderHelper = {};

renderHelper.render = function(canvas, data, tessellation, previousData, paginationOffset) {
  if (!uiState.hasPreloaded) {
      const canvasClearPromise = new Promise(function (resolve, reject) {
        canvas.clear();
        resolve();
      });

    canvasClearPromise
      .then(() => renderHelper._preload(canvas, data, tessellation))
      .then(() => renderHelper._addStartingStates(data, tessellation))
      .then(() => imageHelper.loadImages(data))
      .then(() => renderHelper._createImagesWithTimeout(canvas, data, tessellation))
      .then(() => renderHelper._addAmbientAnimations(data, tessellation))
      .then(() => renderHelper._bounceAfterLoad(data));

    uiState.hasPreloaded = true;
  } else {
    const numRecordsToRemove = Math.abs(paginationOffset);
    const numRecordsToKeep = data.length - Math.abs(paginationOffset);
    renderHelper._fadeOutOldRecords(data, previousData,paginationOffset, numRecordsToRemove)
    renderHelper._moveRecordToKeep(data, previousData, paginationOffset, tessellation, numRecordsToKeep);

    setTimeout(() => {
      renderHelper._addStartingStates(data, tessellation);
      imageHelper.loadImages(data)
        .then(() => canvas.clear())
        .then(() => renderHelper._createImagesWithNoTimeout(canvas, data, tessellation))
        .then(() => {
          for (let i = 0; i < numRecordsToRemove; i++) {
            const index = paginationOffset < 0 ? i : data.length - 1 - i;
            const newRecordToFadeIn = data[index];
            newRecordToFadeIn.image.set('opacity', 0);
            uiHelper.fadeInRecord(newRecordToFadeIn);
          }

          for (let i = 0; i < numRecordsToRemove; i++) {
            const index = paginationOffset > 0 ? i : data.length - 1 - i;
            const oldRecordToFadeOut = previousData[index];
            canvas.remove(oldRecordToFadeOut.image)
          }
        })
        .then(() => renderHelper._addAmbientAnimations(data, tessellation));
    }, 1200);
  }
}


// "Private" methods from here:
renderHelper._bounceAfterLoad = function (data) {
  for (let i = 0; i < data.length; i++) {
      const record = data[i];
      uiHelper.bounceRecordSmall(record);
  }
}

renderHelper._fadeOutOldRecords = function(data, previousData, paginationOffset, numRecordsToRemove) {
    for (let i = 0; i < numRecordsToRemove; i++) {
      const index = paginationOffset > 0 ? i : data.length - 1 - i;
      const oldRecordToFadeOut = previousData[index];
      uiHelper.fadeOutRecord(oldRecordToFadeOut);
    }
}

renderHelper._moveRecordToKeep = function(data, previousData, paginationOffset, tessellation, numRecordsToKeep) {
  for (let i = 0; i < numRecordsToKeep; i++) {
      const index = paginationOffset < 0 ? i : data.length - 1 - i;
      const oldRecordToMove = previousData[index];
      const newRecord = data[index - paginationOffset];
      const xTarget = newRecord.x + ((tessellation.xMoveOffset - newRecord.image.width) / 2);
      const yTarget = newRecord.y + ((tessellation.yMoveOffset - newRecord.image.height) / 2);
      uiHelper.moveRecordTo(oldRecordToMove, xTarget, yTarget);
  }
}

renderHelper._addStartingStates = function(data, tessellation) {
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    renderHelper._addStartingStateToRecord(record, i, tessellation);
    renderHelper._setMouseListeners(record, data, tessellation);
  }
  return;
}

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
    // See notes for commentary about the Weird Image Loading!
    const loadBigImageEarly = fabricImageLoad(record.imagePath);
    uiState.bigImage.isShowing = true;
    uiState.bigImage.isAnimating = true;
    uiHelper.updateTextWithArtistAndTitle(record);
    if (uiState.localPlayback) {
      uiHelper.updateTextForLocalPlayback(record);
    }
    // let's muck with the background!
    const gradientString = `linear-gradient(90deg, #FFF, #FFF, ${record.colors[0]}, ${record.colors[1]}, #FFF, #FFF)`
    const bodyElement = document.body;
    bodyElement.style.animationPlayState = 'running';
    bodyElement.style.backgroundImage = gradientString;
    console.log("bloop");

    /*
    uiHelper.waitFor(10000).then(() => {
      bodyElement.style.animationPlayState = 'paused';
    });
    */



    uiHelper.updateTextForFocus(record);
    record.playFunc = vlcHelper.makePlayFunc(record);
    document.getElementById("text").addEventListener("click", record.playFunc);

    uiHelper.replaceOtherRecords(record, data, tessellation.timeouts.slow)
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
      document.getElementById("text").removeEventListener("click", record.playFunc);
      if (uiState.localPlayback) {
        uiHelper.resetTextForLocalPlayback(record);
      }
      uiHelper.resetTextForFocus(record);

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

renderHelper._pickTimeout = function(tessellation) {
  const timeoutIndex = Math.floor(Math.random() * tessellation.timeoutFunctions.length);
  const reverseIndex = Math.floor(Math.random() * 2);
  return tessellation.timeoutFunctions[timeoutIndex][reverseIndex];
}


renderHelper._preload = function(canvas, data, tessellation) {
  let preloadColorPromises = [];
  const timeoutFunction = renderHelper._pickTimeout(tessellation);
  for (var i = 0; i < data.length; i++) {
    let record = data[i];
    let preloadCircle = uiState.preloadedObjects[i];
    const timeoutMs = timeoutFunction(i, data.length, tessellation.timeouts["slow"])

    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        canvas.remove(preloadCircle);
        const radius = tessellation.preloadRadius;
        let hexPoints = uiHelper.getHexPoints(radius);
        let hex = new fabric.Polygon(hexPoints, {left: record.imageX - radius, top: record.imageY - radius});
        let gradient = uiHelper.getGradient(record.colors[0], record.colors[1], hex.height);
        hex.set('fill', gradient)
        canvas.add(hex);
        record.preloadObject = hex;
        const timeout = Math.floor(Math.random() * 1000) + 250;
        setTimeout(() => {
          animationHelper.makeSmallBounceRaw(hex, {})();
        }, timeout);
        resolve();
      }, timeoutMs);
    });
    preloadColorPromises.push(p);
  }

  return Promise.all(preloadColorPromises);
}

renderHelper._createImagesWithTimeout = function(canvas, data, tessellation) {
  let imageLoadPromises = [];
  const timeoutFunction = renderHelper._pickTimeout(tessellation);
  for (var i = 0; i < data.length; i++) {
    const record = data[i];
    const timeout = timeoutFunction(i, data.length, tessellation.timeouts["slow"])

    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        renderHelper._createImageAndClickState(canvas, record, data, tessellation);
        resolve();
      }, timeout);
    })
    imageLoadPromises.push(p);
  }
  return Promise.all(imageLoadPromises);
}

renderHelper._createImagesWithNoTimeout = function(canvas, data, tessellation) {
  for (var i = 0; i < data.length; i++) {
    let record = data[i];
    renderHelper._createImageAndClickState(canvas, record, data, tessellation);
  }
}

renderHelper._createImageAndClickState = function(canvas, record, data, tessellation) {
  canvas.remove(record.preloadObject);
  record.image = renderHelper._createAndRenderImage(canvas, record);
  record.clickable = renderHelper._createClickableMask(record, tessellation)
  renderHelper._createDefaultClickState(canvas, record, data);
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

renderHelper._addAmbientAnimations = function(data, tessellation) {
  const timeoutOffsetMs = 8000;
  const maxTimeoutMs = tessellation.defaultItems * 1000 * 16;
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const interval = Math.ceil(Math.random() * maxTimeoutMs) + timeoutOffsetMs;
    setInterval(() => {
      uiHelper.ambientAnimate(record);
    }, interval);
  }
  return;
}
