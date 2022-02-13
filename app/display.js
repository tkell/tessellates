// pick a tessellation, then ..
tess = makeTriangle(); 
fetch('vinyl.json')
  .then(response => response.json())
  .then(data => {
      var canvas = new fabric.Canvas('vinylCanvas');
      canvas.hoverCursor = 'default';
      tess.render(canvas, tess.prepare(data))
  });
