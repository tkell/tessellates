let uiHelper = {}

uiHelper.waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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


// Animations
uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
}

uiHelper.fadeRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeFade(record)();
  }
}

uiHelper.walkaboutRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeWalkabout(record)();
    animationHelper.makeBounce(record)();
  }
}

uiHelper.ambientAnimate = function(record) {
  if (uiState.bigImage.isShowing === true) return;

  const functionIndex = Math.floor(Math.random() * uiHelper._ambientAnimations.length);
  const animation = uiHelper._ambientAnimations[functionIndex];
  animation(record);
}

uiHelper._ambientAnimations = [
  uiHelper.bounceRecord,
  uiHelper.bounceRecord,
  uiHelper.fadeRecord,
  uiHelper.fadeRecord,
  uiHelper.walkaboutRecord
];

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
      return uiHelper.loadCloseUpReplacementImage(record, otherRecord).then(() => resolve());
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
    return tempImage;
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
      return uiHelper.loadReplacementImage(record, otherRecord).then(() => { resolve(); })
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
    return tempImage;
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

// Fabric helpers:  Hexagons and gradients
uiHelper.getHexPoints = function(radius) {
    const sideCount = 6
    const sweep = Math.PI * 2 / sideCount;
    const cx = radius;
    const cy = radius;
    const points = [];
    for (let i = 0; i < sideCount; i++) {
        let x = cx + radius * Math.cos(i * sweep);
        let y = cy + radius * Math.sin(i * sweep);
        points.push({x:x, y:y});
    }
    return(points);
}

uiHelper.getGradient = function(color1, color2, size) {
  const x1 = Math.floor(Math.random() * 10);
  const y1 = Math.floor(Math.random() * 10);
  const x2 = Math.floor(Math.random() * 10);
  const y2 = size - Math.floor(Math.random() * 10);

  return new fabric.Gradient({
    type: 'linear',
    coords: {x1: x1, y1: y1, x2: x2, y2: y2},
    colorStops: [
      {offset: 0, color: color1},
      {offset: 1, color: color2}
    ]
  });
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
