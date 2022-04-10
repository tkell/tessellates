let uiHelper = {}

uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
}

uiHelper.animateOtherRecordsAway = function(record, data) {
  for (var i = 0; i < data.length; i++) {
    let otherRecord = data[i];
    animationHelper.bounceAway(otherRecord)();
  }
}

uiHelper.animateOtherRecordsBack = function(record, data) {
  for (var i = 0; i < data.length; i++) {
    let otherRecord = data[i];
    animationHelper.bounceBack(otherRecord)();
  }
}

uiHelper.restoreOtherRecords = function() {
  for (let tempImage of uiState.tempImages) {
    let removeImage = function() {
      canvas.remove(tempImage);
    }
    let timeoutMs = Math.floor(Math.random() * (500 - 75) ) + 75;
    setTimeout(removeImage, timeoutMs);
  }
}

uiHelper.replaceOtherRecords = function(record, data) {
  let promises = [];
  uiState.tempImages = [];
  for (var i = 0; i < data.length; i++) {
    let otherRecord = data[i];
    let loadImage = function() {
      fabricImageLoad(record.imagePath).then(tempImage => {
        tempImage.clipPath = otherRecord.clipPath;
        tempImage.left = otherRecord.imageX - (record.image.width / 2);
        tempImage.top = otherRecord.imageY - (record.image.height / 2);
        tempImage.selectable = false;
        canvas.add(tempImage);
        canvas.sendToBack(record.image);
        tempImage.applyFilters();
        uiState.tempImages.push(tempImage);
        canvas.bringToFront(uiState.currentBigImage); // a hack!
      });
    }

    let timeoutMs = Math.floor(Math.random() * (750 - 125) ) + 125;
    // gotta be able to be more clever about closure-ish stuff here ...
    let p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        loadImage();
        resolve();
      }, timeoutMs);
    });
    promises.push(p);
  }
  // this resolves instantly because there's nothing in it!
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

uiHelper.setGreyscaleImageFilters = function (data) {
  for (let record of data) {
    record.image.filters.push(new fabric.Image.filters.Grayscale());
    record.image.applyFilters();
  }
}

uiHelper.clearAllImageFilters = function (data) {
  for (let record of data) {
    uiHelper.clearImageFilters(record);
  }
}

uiHelper.clearImageFilters = function(record) {
  record.image.filters = [];
  record.image.applyFilters();
}

uiHelper.displayBigImage = function(record, data, canvas) {
  canvas.remove(data.currentBigImage);
  record.bigImage.left = record.bigImageX - (record.bigImage.width / 2)
  record.bigImage.top = record.bigImageY - (record.bigImage.height / 2)
  record.bigImage.selectable = false;
  record.bigImage.clipPath = record.bigClipPath;
  canvas.add(record.bigImage);
  canvas.bringToFront(record.bigImage);
  uiState.currentBigImage = record.bigImage;
  return record.bigImage;
}

uiHelper.removeBigImage = function (data, canvas) {
  canvas.remove(uiState.currentBigImage);
  uiState.currentBigImage = undefined;
}
