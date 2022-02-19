let params = getSearchParameters();
let parsedParams = parseTessellatesParams(params)

// pick a tessellation, then ..
if (parsedParams['t'] == 'square') {
  tess = makeSquare();
} else if (parsedParams['t']== 'rhombus') {
  tess = makeRhombus();
} else {
  tess = makeTriangle();
}
var vinylData = [];
var canvas = null;

function renderCanvas(canvas, tess, data, params) {
    canvas.clear();
    offset = params['offset'];
    end = offset + params['items'];
    slicedData = data.slice(offset, end);
    tess.render(canvas, tess.prepare(slicedData))
}

fetch('vinyl.json')
  .then(response => response.json())
  .then(data => {
    canvas = new fabric.Canvas('vinylCanvas');
    canvas.hoverCursor = 'default';
    vinylData = data;
    renderCanvas(canvas, tess, vinylData, params)
  });

window.onload = function(event) {
  document.getElementById('back').addEventListener("click", function(e) {
    params['offset'] = Math.max(0, params['offset'] - 10)
    renderCanvas(canvas, tess, vinylData, params);
  })
  document.getElementById('forward').addEventListener("click", function(e) {
    params['offset'] = Math.min(vinylData.length, params['offset'] + 10)
    renderCanvas(canvas, tess, vinylData, params);
  })
};
