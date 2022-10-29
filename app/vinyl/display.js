var vinylData = [];
var uiState = {
  closeUpImages: [],
  bigImage: {
    image: null,
    isShowing: false,
    isAnimating: false
  }
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
  let folder = params['folder'];
  var filteredData = data;
  if (folder) {
    filteredData = data.filter(record => record.folder.toLowerCase() === folder.toLowerCase());
  }

  let offset = params['offset'];
  let end = offset + params['items'];
  let slicedData = filteredData.slice(offset, end);
  tess.render(canvas, tess.prepare(slicedData))
}

function addPagingClick(elementId, offsetDelta) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (!uiState.bigImage.isShowing) {
      params['offset'] = Math.max(0, params['offset'] +  offsetDelta);
      renderCanvas(canvas, tess, vinylData, params);
    }
  });
}

function addFolderClick(elementId, folder) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (!uiState.bigImage.isShowing) {
      uiHelper.clearTitle();
      params['folder'] = folder;
      params['offset'] = 0;
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

    addFolderClick("balearic", '\"Balearic\"');
    addFolderClick("world", '\"World Music\" / Exotica');
    addFolderClick("seven-inches", '7\"');
    addFolderClick("battletech", 'Battletech');
    addFolderClick("breaks", 'Breaks');
    addFolderClick("classical", 'Classical');
    addFolderClick("disco", 'Disco');
    addFolderClick("ambient-albums", 'Electronic Albums / Ambient');
    addFolderClick("house-tech-dance", 'House/Tech/Dance');
    addFolderClick("progressive", 'Progressive');
    addFolderClick("swing-rock-albums", 'Swing / Rock / Soul Albums');
    addFolderClick("techno", 'Techno');
    addFolderClick("trance", 'Trance');
    addFolderClick("wall-records", 'Wall Records');
    addFolderClick("all", false);
  });
