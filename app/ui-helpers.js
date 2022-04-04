let uiHelper = {}

uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
  }
}

uiHelper.animateOtherRecordsAway = function(record, data) {
  // indexesToAnimate = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 19];
  for (var i = 0; i < data.length; i++) {
    let otherRecord = data[i];
    animationHelper.bounceAway(otherRecord)();
  }
}

uiHelper.replaceOtherRecords = function(record, data) {
  for (var i = 0; i <= data.length; i++) {
    let otherRecord = data[i];
    let promise = fabricImageLoad(record.imagePath).then(img => {
      record.image = img;
      record.image.clipPath = otherRecord.clipPath;
      record.image.left = otherRecord.imageX - (record.image.width / 2);
      record.image.top = otherRecord.imageY - (record.image.height / 2);
      record.image.selectable = false;
      canvas.add(record.image);
      canvas.sendToBack(record.image);
      record.image.filters.push(new fabric.Image.filters.Brightness({brightness: -0.2}));
      record.image.filters.push(new fabric.Image.filters.Blur({blur: 0.05}));
      record.image.applyFilters();
    });
  }
}

uiHelper.animateOtherRecordsBack = function(record, data) {
  indexesToAnimate = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 19];
  for (var i = 0; i < data.length; i++) {
    if (indexesToAnimate.includes(i)) {
      let otherRecord = data[i];
      animationHelper.bounceBack(otherRecord)();
    }
  }
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
  data.currentBigImage = record.bigImage;
  return record.bigImage;
}

uiHelper.removeBigImage = function (data, canvas) {
  canvas.remove(data.currentBigImage);
  data.currentBigImage = undefined;
}
