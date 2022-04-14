let uiHelper = {}

uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
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
  return Promise.all(promises);
}


uiHelper.loadClippedReplacementImage = function(record, otherRecord) {
  return fabricImageLoad(record.imagePath).then(tempImage => {
    tempImage.clipPath = otherRecord.clipPath;

    tempImage.clipPath = fabric.util.object.clone(otherRecord.clipPath);
    tempImage.clipPath.left = otherRecord.x - (334); // - rhombus.xSize
    tempImage.clipPath.top = otherRecord.imageY - (334 * 1.15); // ??

    tempImage.left = record.bigImageX - (record.bigImage.width / 2);
    tempImage.top = record.bigImageY - (record.bigImage.height / 2);
    tempImage.selectable = false;
    canvas.add(tempImage);
    canvas.bringToFront(tempImage);
    uiState.tempImages.push(tempImage);
  });
}

// WORKING, NEEDS A TON OF A TON OF REEEEFACTORING!
uiHelper.replaceClippedImage = function(record, data) {
  let toUse = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 19];
  let promises = [];
  uiState.tempImages = [];
  for (var i = 0; i < data.length; i++) {
    if (!toUse.includes(i)) continue;

    let otherRecord = data[i];
    let timeoutMs = Math.floor(Math.random() * (750 - 125) ) + 125;
    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        uiHelper.loadClippedReplacementImage(record, otherRecord).then(() => {
          resolve();
        })
      }, timeoutMs);
    });
    promises.push(p);
  }
  return Promise.all(promises);
}

uiHelper.loadReplacementImage = function(record, otherRecord) {
  return fabricImageLoad(record.imagePath).then(tempImage => {
    tempImage.clipPath = otherRecord.clipPath;
    tempImage.left = otherRecord.imageX - (record.image.width / 2);
    tempImage.top = otherRecord.imageY - (record.image.height / 2);
    tempImage.selectable = false;
    canvas.add(tempImage);
    canvas.bringToFront(tempImage);
    uiState.tempImages.push(tempImage);
  });
}

uiHelper.replaceOtherRecords = function(record, data) {
  let promises = [];
  uiState.tempImages = [];
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


uiHelper.updateTextWithTitle = function(record, data) {
  if (data.currentBigImage === undefined) {
    var t = document.getElementById('text');
    t.textContent = record.title;
  }
}

uiHelper.updateTextWithArtistAndTitle = function(record) {
  var t = document.getElementById('text');
  t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
}

uiHelper.displayBigImage = function(record, data, canvas) {
  canvas.remove(data.currentBigImage);
  record.bigImage.left = record.bigImageX - (record.bigImage.width / 2)
  record.bigImage.top = record.bigImageY - (record.bigImage.height / 2)
  record.bigImage.selectable = false;
  record.bigImage.clipPath = record.bigClipPath;
  canvas.add(record.bigImage);
  uiState.currentBigImage = record.bigImage;
  canvas.bringToFront(record.bigImage);
  return record.bigImage;
}

uiHelper.removeBigImage = function (data, canvas) {
  canvas.remove(uiState.currentBigImage);
  uiState.currentBigImage = undefined;
}
