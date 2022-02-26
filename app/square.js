makeSquare = function() {
  square = {};
  square.xSize = 334;
  square.ySize = 334;
  square.size = 1000;
  let squareClipPath = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    width: square.xSize,
    height: square.ySize,
    selectable: false,
  });
  
  square.prepare = function(data) {
    var x = 0;
    var y = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.imageX = record.x + (square.xSize / 2);
      record.imageY = record.y + (square.ySize / 2);
      record.clipPath = squareClipPath;
      x = x + this.xSize;
      if (x > this.size) {
        x = 0;
        y = y + this.ySize;
      }
    }
    return data;
  }
  
  square.render = function(c, data) {
    for (let record of data) {
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        tessellationHelper.createImage(c, img, record);
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
