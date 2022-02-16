let params = getSearchParameters();
let parsedParams = parseTessellatesParams(params)
//
// pick a tessellation, then ..
if (parsedParams['t'] == 'square') {
    tess = makeSquare();
} else {
    tess = makeTriangle();
}

fetch('vinyl.json')
  .then(response => response.json())
  .then(data => {
      offset = params['offset'];
      end = offset + params['items'];
      data = data.slice(offset, end);
      var canvas = new fabric.Canvas('vinylCanvas');
      canvas.hoverCursor = 'default';
      tess.render(canvas, tess.prepare(data))
  });
