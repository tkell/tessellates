function rhombusPoints(x, y, size) {
  yDelta = Math.floor(Math.cos(Math.PI / 6) * size);
  xDelta = Math.floor(Math.sin(Math.PI / 6) * size);

  p1 = {x: x, y: y};
  p2 = {x: x + xDelta, y: y + yDelta};
  p3 = {x: x, y: y + (yDelta * 2)};
  p4 = {x: x - xDelta, y: y + yDelta};

  return [p1, p2, p3, p4];
}

makeRhombus = function() {
  square = {};

  square.rhombusSize = 195;
  xShift = Math.floor(Math.cos(Math.PI / 6) * square.rhombusSize);
  yShift = Math.floor(Math.sin(Math.PI / 6) * square.rhombusSize);

  square.xSize = xShift * 2;
  square.ySize = yShift * 4;
  square.size = 1000;

  let rpoints = rhombusPoints(0, 0, square.rhombusSize);
 
  let clipPathCenter = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: 90,
  });

  let clipPathRight = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: 30,
  });

  let clipPathLeft = new fabric.Polygon(rpoints, {
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center',
    selectable: false,
    angle: -30,
  });

  function prepareSubset(data, divisor, remainer, xStart, yStart, clipPath) {
    var x = xStart;
    var y = yStart;
    for (var i = 0; i < data.length; i++) {
      if (i % divisor == remainer) {
        record = data[i];
        if (x >= (square.size + xStart)) {
          x = xStart;
          y = yStart + square.ySize;
        }
        record.x = x;
        record.y = y
        record.clipPath = clipPath;

        x = x + square.xSize;

      }
    }
    return data
  }
  
  square.prepare = function(data) {
    prepareSubset(data, 3, 0, square.xSize * (-0.25), square.ySize * 0.375 , clipPathLeft)
    prepareSubset(data, 3, 1, 0, 0, clipPathCenter)
    prepareSubset(data, 3, 2, xShift * 0.5, square.ySize * 0.375, clipPathRight)
    return data;
  }
  
  square.render = function(c, data) {
    for (let record of data) {
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        img.left = record.x - (img.width / 2) + (square.xSize / 2);
        img.top = record.y - (img.height / 2) + (square.ySize / 2);
        img.selectable = false;
        img.clipPath = record.clipPath;
        c.add(img);
        c.sendToBack(img);
      });

      let squareToClick = new fabric.Rect({
        left: record.x,
        top: record.y,
        perPixelTargetFind: true,
        fill: 'white',
        opacity: 0.001,
        width: square.xSize,
        height: square.ySize,
        selectable: false
      });

      squareToClick.on('mousedown', function(options) {
        var t = document.getElementById('text');
        t.textContent = record.title;
      });

      c.add(squareToClick);
      c.bringToFront(squareToClick);
    }
  }
  return square;
}
