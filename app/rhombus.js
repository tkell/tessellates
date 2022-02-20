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
  rhombus = {};

  rhombus.rhombusSize = 195;
  xShift = Math.floor(Math.cos(Math.PI / 6) * rhombus.rhombusSize);
  yShift = Math.floor(Math.sin(Math.PI / 6) * rhombus.rhombusSize);

  rhombus.xSize = xShift * 2;
  rhombus.ySize = yShift * 4;
  rhombus.size = 1000;

  let rpoints = rhombusPoints(0, 0, rhombus.rhombusSize);
 
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
    var isShortRow = false;
    for (var i = 0; i < data.length; i++) {
      if (i % divisor == remainer) {
        record = data[i];
        // I really don't love this – I feel like my older idea about "moving by centers" might be better?
        if (x >= (rhombus.size + xStart) || (isShortRow && x >= (rhombus.size + xStart - rhombus.xSize )) ) {
          if (Math.floor(i / 9) % 2 == 1 && isShortRow == false) {
            isShortRow = true;
            x = xStart + rhombus.xSize / 2;
            y = yStart + rhombus.ySize - (rhombus.ySize * 0.25);
          } else { 
            isShortRow = false;
            x = xStart;
            y = yStart + rhombus.ySize + (rhombus.ySize * 0.5);
          }
        }
        record.x = x;
        record.y = y
        record.clipPath = clipPath;

        x = x + rhombus.xSize;
      }
    }
    return data
  }
  
  rhombus.prepare = function(data) {
    prepareSubset(data, 3, 0, rhombus.xSize * (-0.25), rhombus.ySize * 0.375 , clipPathLeft)
    prepareSubset(data, 3, 1, 0, 0, clipPathCenter)
    prepareSubset(data, 3, 2, xShift * 0.5, rhombus.ySize * 0.375, clipPathRight)
    return data;
  }
  
  rhombus.render = function(c, data) {
    for (let record of data) {
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        img.left = record.x - (img.width / 2) + (rhombus.xSize / 2);
        img.top = record.y - (img.height / 2) + (rhombus.ySize / 2);
        img.selectable = false;
        img.clipPath = record.clipPath;
        c.add(img);
        c.sendToBack(img);
      });
      

      // not a rhombus at all!  Need to make this work too
      let rhombusToClick = new fabric.Rect({
        left: record.x,
        top: record.y,
        perPixelTargetFind: true,
        fill: 'white',
        opacity: 0.001,
        width: rhombus.xSize,
        height: rhombus.ySize,
        selectable: false
      });

      rhombusToClick.on('mousedown', function(options) {
        var t = document.getElementById('text');
        t.textContent = record.title;
      });

      c.add(rhombusToClick);
      c.bringToFront(rhombusToClick);
    }
  }
  return rhombus;
}
