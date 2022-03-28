makeTriangle = function () {
  triangle = {};
  triangle.xSize = 200;
  triangle.ySize = 200;
  triangle.size = 1000;
  triangle.defaultItems = 45;
  triangle.paging = {"small": 1, "medium": 9, "big": 45};

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

  let clipPathBig = new fabric.Triangle({
    originX: 'center',
    originY: 'center',
    width: triangle.xSize * 3.5,
    height: triangle.ySize * 3.5,
    selectable: false,
  });
  
  triangle.prepare = function(data) {
    var x = 0;
    var y = 0;
    var angle = 0;
    for (let record of data) {
      record.x = x;
      record.y = y;
      record.angle = angle;
      record.isAnimating = false;
      record.imagePath = "images/" + record.id + ".jpg";

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

      record.bigClipPath = clipPathBig;
      record.bigImageX = triangle.xSize * 2.5;
      record.bigImageY = triangle.ySize * 2.5;

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
    imageHelper.loadImages(data)
    .then(() => {
      for (let record of data) {
        record.image = tessellationHelper.createAndRenderImage(canvas, record);
      }
      for (let record of data) {
        record.clickable = tessellationHelper.createClickableMask(fabric.Triangle, record, triangle.xSize, triangle.ySize)
      }
      for (let record of data) {
        tessellationHelper.createDefaultClickState(c, record, data);
      }
    });
  }

  return triangle;
}
