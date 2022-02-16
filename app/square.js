makeSquare = function() {
  square = {};
  square.xSize = 334;
  square.ySize = 334;
  square.size = 1000;
  
  square.prepare = function(data) {
    var x = 0;
    var y = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
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
      var squareClipPath = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width: this.xSize,
        height: this.ySize,
        selectable: false,
      });
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        img.left = record.x - (img.width / 2) + (square.xSize / 2);
        img.top = record.y - (img.height / 2) + square.ySize / 2;
        img.selectable = false;
        img.clipPath = squareClipPath;
        c.add(img);
      });
    }
  }
  return square;
}
