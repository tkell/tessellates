let uiHelper = {}

uiHelper.bounceRecord = function(record) {
  if (record.isAnimating === false) {
    animationHelper.makeBounce(record)();
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

uiHelper.clearImageFilters = function(record) {
  record.image.filters = [];
  record.image.applyFilters();
}

uiHelper.setGreyscaleImageFilters = function (data) {
  for (let record of data) {
    record.image.filters.push(new fabric.Image.filters.Grayscale());
    record.image.applyFilters();
  }
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

  record.bigImage.on('mousedown', uiHelper.removeBigImage(data, canvas));
}

// maybe we want to move this around later ...
uiHelper.removeBigImage = function (data, canvas) {
  return function() {
      canvas.remove(data.currentBigImage);
      data.currentBigImage = undefined;
      for (let record of data) {
        record.image.filters = [];
        record.image.applyFilters();
      }
  }
}
