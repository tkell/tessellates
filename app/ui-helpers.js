let uiHelper = {}

uiHelper.waitFor = function(milliseconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve, milliseconds)
  });
}

// Text updates
uiHelper.updateTextWithArtistAndTitle = function(record) {
  var t = document.getElementById('text');
  t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
}

uiHelper.updateTextWithTitle = function(record, data) {
  if (data.currentBigImage === undefined) {
    var t = document.getElementById('text');
    t.textContent = record.title;
  }
}

// Bounces
uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
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

uiHelper.replaceCloseUpImage = function(record, data, minTimeMs, maxTimeMs) {
  let promises = [];
  var indexes = [...Array(data.length).keys()];
  if (Math.random() > 0.5) {
    indexes = indexes.reverse();
  }
  for (var i = 0; i < indexes.length; i++) {
    let index = indexes[i]
    let otherRecord = data[index];
    if (!otherRecord.isCloseUp) continue;
    let timeoutMs = getLinearTimeout(i, data.length, maxTimeMs);
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
      record.bigImageX - (record.bigImage.width / 2),
      record.bigImageY - (record.bigImage.height / 2),
    );
    uiState.tempImages.push(tempImage);
  });
}

uiHelper.replaceOtherRecords = function(record, data, minTimeMs, maxTimeMs) {
  let promises = [];
  var indexes = [...Array(data.length).keys()];
  if (Math.random() > 0.5) {
    indexes = indexes.reverse();
  }
  for (var i = 0; i < indexes.length; i++) {
    let index = indexes[i]
    let otherRecord = data[index];
    let timeoutMs = getLinearTimeout(i, data.length, maxTimeMs)
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
  return fabricImageLoad(record.imagePath).then(tempImage => {
    addAndClipImage(
      tempImage,
      otherRecord.clipPath,
      otherRecord.imageX - (record.image.width / 2),
      otherRecord.imageY - (record.image.height / 2),
    );
    uiState.tempImages.push(tempImage);
  });
}

uiHelper.restoreOtherRecords = function(minTimeMs, maxTimeMs) {
  let promises = [];
  for (let tempImage of uiState.tempImages) {
    let timeoutMs = getRandomTimeout(minTimeMs, maxTimeMs);
    let p = promiseToRemoveImage(tempImage, timeoutMs);
    promises.push(p);
  }
  uiState.tempImages = [];
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
  canvas.remove(data.currentBigImage);
    addAndClipImage(
      record.bigImage,
      record.bigClipPath,
      record.bigImageX - (record.bigImage.width / 2),
      record.bigImageY - (record.bigImage.height / 2),
    );
  uiState.currentBigImage = record.bigImage;
  return record.bigImage;
}

uiHelper.removeBigImage = function (data, canvas) {
  canvas.remove(uiState.currentBigImage);
  uiState.currentBigImage = undefined;
}


// Private helpers
function getRandomTimeout(maxTimeMs, minTimeMs) {
  return Math.floor(Math.random() * (maxTimeMs - minTimeMs)) + minTimeMs;
}

function getLinearTimeout(index, maxIndex, maxTimeMs) {
  let step = Math.floor(maxTimeMs / maxIndex);
  return step * index;
}

function addAndClipImage(image, clipPath, left, top) {
  image.clipPath = clipPath;
  image.left = left;
  image.top = top
  image.selectable = false;
  canvas.add(image);
  canvas.bringToFront(image);
}
