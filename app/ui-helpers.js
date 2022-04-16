let uiHelper = {}

uiHelper.waitFor = function(milliseconds) {
  return new Promise(function(resolve) {
    setTimeout(resolve, milliseconds)
  });
}

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

uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
}

// WORKING, NEEDS A TON OF A TON OF REEEEFACTORING!
uiHelper.replaceClippedImage = function(record, data) {
  let toUse = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 19];
  let promises = [];
  for (var i = 0; i < data.length; i++) {
    if (!toUse.includes(i)) continue;

    let otherRecord = data[i];
    let timeoutMs = Math.floor(Math.random() * (750 - 125) ) + 125;
    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        uiHelper.loadClippedReplacementImage(record, otherRecord)
          .then(() => {
            resolve();
          })
      }, timeoutMs);
    });
    promises.push(p);
  }
  return Promise.all(promises);
}

uiHelper.replaceOtherRecords = function(record, data) {
  let promises = [];
  for (var i = 0; i < data.length; i++) {
    let otherRecord = data[i];
    let timeoutMs = Math.floor(Math.random() * (750 - 125) ) + 125;
    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        uiHelper.loadReplacementImage(record, otherRecord).then(() => {
          resolve();
        })
      }, timeoutMs);
    });
    promises.push(p);
  }
  return Promise.all(promises);
}

uiHelper.loadClippedReplacementImage = function(record, otherRecord) {
  return fabricImageLoad(record.imagePath).then(tempImage => {
    tempImage.clipPath = otherRecord.clipPath;
    tempImage.clipPath = fabric.util.object.clone(otherRecord.clipPath);
    tempImage.clipPath.left = otherRecord.x - (334); // - rhombus.xSize
    tempImage.clipPath.top = otherRecord.imageY - (334 * 1.15); // ??

    addAndClipImage(
      tempImage,
      tempImage.clipPath,
      record.bigImageX - (record.bigImage.width / 2),
      record.bigImageY - (record.bigImage.height / 2),
    );
    uiState.tempImages.push(tempImage);
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

uiHelper.restoreOtherRecords = function() {
  let promises = [];
  for (let tempImage of uiState.tempImages) {
    let timeoutMs = Math.floor(Math.random() * (300 - 100) ) + 100;
    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        canvas.remove(tempImage);
        resolve();
      }, timeoutMs);
    });
    promises.push(p);
  }
  uiState.tempImages = [];
  return Promise.all(promises);
}

function addAndClipImage(image, clipPath, left, top) {
  image.clipPath = clipPath;
  image.left = left;
  image.top = top
  image.selectable = false;
  canvas.add(image);
  canvas.bringToFront(image);
}
