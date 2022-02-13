makeTriangle = function () {
  triangle = {};
  triangle.xSize = 200;
  triangle.ySize = 200;
  triangle.size = 1000;
  
  triangle.prepare = function(data) {
    var x = 0;
    var y = 0;
    var angle = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.angle = angle;
      if (angle === 0) {
        x = x + this.xSize / 2;
        angle = 180;
      } else if (angle === 180) {
        x = x + this.xSize / 2;
        angle = 0
      }
      if (x + (this.xSize) > this.size) {
        x = 0;
        angle = 0;
        y = y + this.ySize;
      }
    }
    return data;
  }
  
  triangle.render = function(c, data) {
    for (let record of data) {
      let triangleClipPath = new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        width: this.xSize,
        height: this.ySize,
        angle: record.angle,
        selectable: false,
      });
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        img.left = record.x - (img.width / 2) + (triangle.xSize / 2);
        img.top = record.y - (img.height / 2) + triangle.ySize / 2;
        img.selectable = false;
        img.clipPath = triangleClipPath;
        c.add(img);
      });
    }
  }
  return triangle;
}
