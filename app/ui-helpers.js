let uiHelper = {}

uiHelper.waitFor = function(milliseconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve, milliseconds)
  });
}


// These should go somewhere else, eventually
uiHelper.setMouseListeners = function(record, data, tessellation) {
  record.onMouseOver = function() {
    uiHelper.bounceRecord(record);
    uiHelper.updateTextWithTitle(record);
  }

  record.onMouseDown = function() {
    uiState.bigImage.isShowing = true;
    uiState.bigImage.isAnimating = true;
    uiHelper.updateTextWithArtistAndTitle(record);
    uiHelper.replaceOtherRecords(record, data, tessellation.timeouts.slow)
      .then(() => {
        uiHelper.hideExistingImages(data);
        uiHelper.replaceCloseUpImage(record, data, tessellation.timeouts.slow);
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

// Text updates
uiHelper.updateTextWithArtistAndTitle = function(record) {
  var t = document.getElementById('text');
  t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
}

uiHelper.updateTextWithTitle = function(record) {
  if (uiState.bigImage.isShowing === false) {
    let t = document.getElementById('text');
    t.textContent = record.title;
  }
}

uiHelper.clearTitle = function(record) {
  let t = document.getElementById('text');
  t.textContent = "tessellates";
}

uiHelper.updateTextWithTrack = function(record) {
  let t = document.getElementById('track-text');
  let track = record.tracks[record.nextTrackToShow];
  let trackString = `${track.position} - ${track.title}`
  t.textContent = trackString;
  record.nextTrackToShow = (record.nextTrackToShow + 1) % record.tracks.length;
}

uiHelper.clearTrack = function() {
  let t = document.getElementById('track-text');
  t.textContent = "-";
}

// Bounces
uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
}

uiHelper.bounceBigImage = function() {
  let bigImage = uiState.bigImage;
  if (bigImage.image && bigImage.isShowing === true && bigImage.isAnimating === false) {
    animationHelper.makeBounce(bigImage)();
  }
}

// Image Loopers + promises
uiHelper.hideExistingImages = function(data) {
  for (var i = 0; i < data.length; i++) {
    let r = data[i];
    r.image.visible = false;
  }
}

uiHelper.showExistingImages = function(data) {
  for (var i = 0; i < data.length; i++) {
    let r = data[i];
    r.image.visible = true;
  }
}

uiHelper.replaceCloseUpImage = function(record, data, maxTimeMs) {
  let promises = [];
  var indexes = [...Array(data.length).keys()];
  for (var i = 0; i < indexes.length; i++) {
    let index = indexes[i]
    let otherRecord = data[index];
    if (!otherRecord.isCloseUp) continue;
    let timeoutMs = record.timeoutFunction(i, data.length, maxTimeMs);
    let p = promiseToLoadCloseUpImage(record, otherRecord, timeoutMs);
    promises.push(p);
  }
  return Promise.all(promises);
}

function promiseToLoadCloseUpImage(record, otherRecord, timeoutMs) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      uiHelper.loadCloseUpReplacementImage(record, otherRecord).then(() => { resolve(); })
    }, timeoutMs);
  });
}

uiHelper.loadCloseUpReplacementImage = function(record, otherRecord) {
  return fabricImageLoad(record.imagePath).then(tempImage => {
    tempImage.clipPath = otherRecord.clipPath;
    tempImage.clipPath = fabric.util.object.clone(otherRecord.clipPath);
    tempImage.clipPath.left = otherRecord.tempClipPathX;
    tempImage.clipPath.top = otherRecord.tempClipPathY;

    addAndClipImage(
      tempImage,
      tempImage.clipPath,
      record.bigImageX - (tempImage.width / 2),
      record.bigImageY - (tempImage.height / 2),
    );
    uiState.closeUpImages.push({img: tempImage, index: otherRecord.index});
  });
}

uiHelper.replaceOtherRecords = function(record, data, maxTimeMs) {
  let promises = [];
  var indexes = [...Array(data.length).keys()];

  for (var i = 0; i < indexes.length; i++) {
    let index = indexes[i]
    let otherRecord = data[index];
    let timeoutMs = record.timeoutFunction(i, data.length, maxTimeMs)
    let p = promiseToLoadRegularImage(record, otherRecord, timeoutMs);
    promises.push(p);
  }
  return Promise.all(promises);
}

function promiseToLoadRegularImage(record, otherRecord, timeoutMs) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      uiHelper.loadReplacementImage(record, otherRecord).then(() => { resolve(); })
    }, timeoutMs);
  });
}

uiHelper.loadReplacementImage = function(record, otherRecord) {
  return fabricImageLoad(record.smallImagePath).then(tempImage => {
    addAndClipImage(
      tempImage,
      otherRecord.clipPath,
      otherRecord.imageX - (record.image.width / 2),
      otherRecord.imageY - (record.image.height / 2),
    );
    otherRecord.tempImageOverlay = tempImage;
  });
}

uiHelper.restoreOtherRecords = function(record, data, maxTimeMs) {
  let promises = [];
  var indexes = [...Array(data.length).keys()];

  for (var i = 0; i < indexes.length; i++) {
    let index = indexes[i]
    let otherRecord = data[index];
    let timeoutMs = record.reverseTimeoutFunction(i, data.length, maxTimeMs)
    let p = promiseToRemoveImage(otherRecord.tempImageOverlay, timeoutMs);
    promises.push(p);
  }
  return Promise.all(promises);
}

uiHelper.removeCloseUpImages = function(record, data, maxTimeMs) {
  let promises = [];
  for (let tempImage of uiState.closeUpImages) {
    let timeoutMs = record.reverseTimeoutFunction(tempImage.index, data.length, maxTimeMs);
    let p = promiseToRemoveImage(tempImage.img, timeoutMs);
    promises.push(p);
  }
  uiState.closeUpImages = [];
  return Promise.all(promises);
}

function promiseToRemoveImage(image, timeoutMs) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      canvas.remove(image);
      resolve();
    }, timeoutMs);
  });
}

// Big Image
uiHelper.displayBigImage = function(record, data, canvas) {
  canvas.remove(uiState.bigImage.image);
  return fabricImageLoad(record.imagePath).then(img => {
    record.bigImage = img;
    addAndClipImage(
      record.bigImage,
      record.bigClipPath,
      record.bigImageX - (record.bigImage.width / 2),
      record.bigImageY - (record.bigImage.height / 2),
    );
    uiState.bigImage.image = record.bigImage;
    return record.bigImage;
  });
}

uiHelper.removeBigImage = function (data, canvas) {
  canvas.remove(uiState.bigImage.image);
  uiState.bigImage.image = undefined;
}


// Private helpers

function addAndClipImage(image, clipPath, left, top) {
  image.clipPath = clipPath;
  image.left = left;
  image.top = top
  image.selectable = false;
  canvas.add(image);
  canvas.bringToFront(image);
}
