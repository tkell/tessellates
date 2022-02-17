makeTriangle = function () {
  triangle = {};
  triangle.xSize = 200;
  triangle.ySize = 200;
  triangle.size = 1000;

  let triangleClipPathUp = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize,
    height: triangle.ySize,
    angle: 0,
    selectable: false
  });

  let triangleClipPathDown = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize,
    height: triangle.ySize,
    angle: 180,
    selectable: false
  });
  
  triangle.prepare = function(data) {
    var x = 0;
    var y = 0;
    var angle = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.angle = angle;

      record.imageX = record.x + (triangle.xSize / 2);
      record.imageY = record.y + (triangle.ySize / 2);
      if (record.angle == 180) {
          record.clipPath = triangleClipPathDown;
          record.clickX = record.x + triangle.xSize;
          record.clickY = record.y + triangle.ySize;
      } else {
          record.clipPath = triangleClipPathUp;
          record.clickX = record.x;
          record.clickY = record.y;
      }

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
      let imagePath = "images/" + record.id + ".jpg"
      fabric.Image.fromURL(imagePath, function(img) {
        img.left = record.imageX - (img.width / 2);
        img.top = record.imageY - (img.height / 2);
        img.selectable = false;
        img.clipPath = record.clipPath;
        c.add(img);
        c.sendToBack(img);
      });

      let triangleToClick = new fabric.Triangle({
        left: record.clickX,
        top: record.clickY,
        perPixelTargetFind: true, // oho
        fill: 'white',
        opacity: 0.001,
        width: this.xSize,
        height: this.ySize,
        angle: record.angle,
        selectable: false
      });
      triangleToClick.on('mousedown', function(options) {
        var t = document.getElementById('text');
        t.textContent = record.title;
      });
      c.add(triangleToClick);
      c.bringToFront(triangleToClick);
    }
  }
  return triangle;
}
