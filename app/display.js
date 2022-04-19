var vinylData = [];
var uiState = {
  tempImages: [],
  bigImageShowing: false,
  currentBigImage: null
};

let params = getSearchParameters();

// pick a tessellation, then ..
let tess = null;
if (params['t'] == 'square') {
  tess = makeSquare();
} else if (params['t']== 'triangle') {
  tess = makeTriangle();
} else {
  tess = makeRhombus();
}

let parsedParams = parseTessellatesParams(params, tess)
var canvas = null;

function renderCanvas(canvas, tess, data, params) {
    canvas.clear();
    offset = params['offset'];
    end = offset + params['items'];
    slicedData = data.slice(offset, end);
    tess.render(canvas, tess.prepare(slicedData))
}

function addPagingClick(elementId, offsetDelta) {
    document.getElementById(elementId).addEventListener("click", function(e) {
      if (!uiState.bigImageShowing) {
        params['offset'] = Math.max(0, params['offset'] +  offsetDelta);
        renderCanvas(canvas, tess, vinylData, params);
      }
    });
}

fetch('vinyl.json')
  .then(response => response.json())
  .then(data => {
    canvas = new fabric.Canvas('vinylCanvas');
    canvas.hoverCursor = 'default';
    vinylData = data;
    renderCanvas(canvas, tess, vinylData, params)

    addPagingClick("back-small", tess.paging.small * -1);
    addPagingClick("back-medium", tess.paging.medium * -1);
    addPagingClick("back-big", tess.paging.big * -1);
    addPagingClick("forward-small", tess.paging.small);
    addPagingClick("forward-medium", tess.paging.medium);
    addPagingClick("forward-big", tess.paging.big);
  });
