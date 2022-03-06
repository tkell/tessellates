let tessellationHelper = {};

tessellationHelper.createImage = function (img, record) {
  img.left = record.imageX - (img.width / 2);
  img.top = record.imageY - (img.height / 2);
  img.selectable = false;
  img.clipPath = record.clipPath;
  return img;
}

// switch SQUARE and TRIANGLE to use this one!
tessellationHelper.createAndRenderImage = function (canvas, record) {
  record.image.left = record.imageX - (record.image.width / 2);
  record.image.top = record.imageY - (record.image.height / 2);
  record.image.selectable = false;
  record.image.clipPath = record.clipPath;
  canvas.add(record.image);
  canvas.sendToBack(record.image);
  return record.image;
}

tessellationHelper.createClickableMask = function (fabricKlass, record, width, height, polygonPoints) {
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

function mouseOverTextUpdate(record) {
  return function() {
    var t = document.getElementById('text');
    t.textContent = record.title;
  }
}

function mouseDownTextUpdate(record) {
  return function() {
    var t = document.getElementById('text');
    t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
  }
}

function clearImageFilters(record) {
  return function() {
    record.image.filters = [];
    record.image.applyFilters();
  }
}

function startBounceAnimation(record) {

  let animateLeft = function() {
    record.image.animate('left', '-=25', {
        onChange: canvas.renderAll.bind(canvas),
        duration: 250,
        onComplete: function() {
          record.image.clipPath = record.clipPath;
          canvas.insertAt(record.image);
        }
    });
  }

  record.image.animate('left', '+=25', {
      onChange: canvas.renderAll.bind(canvas),
      duration: 180,
      onComplete: animateLeft
  });
}

tessellationHelper.createDefaultClickState = function (canvas, record, data) {
  let objectToClick = record.clickable;
  let matchingImg = record.image;
  objectToClick.on('mouseover', mouseOverTextUpdate(record));
  objectToClick.on('mousedown', mouseDownTextUpdate(record));
  objectToClick.on('mousedown', clearImageFilters(record));

  objectToClick.on('mousedown', function(options) {
    for (let otherRecord of data) {
      if (record.id === otherRecord.id) {
        continue;
      }
      otherRecord.image.filters.push(new fabric.Image.filters.Grayscale());
      otherRecord.image.applyFilters();
    }
  });


  objectToClick.on('mousedown', function(options) {
    startBounceAnimation(record);
  });

  canvas.add(objectToClick);
  canvas.bringToFront(objectToClick);
}

