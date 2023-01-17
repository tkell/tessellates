function renderCanvas(canvas, tess, data, params) {
  canvas.clear();
  let folder = params['folder'];
  var filteredData = data;
  if (folder) {
    filteredData = data.filter(record => record.folder.toLowerCase() === folder.toLowerCase());
  }

  let searchString = params['filter'];
  if (searchString) {
    let s = searchString.toLowerCase();
    filteredData = filteredData.filter(record =>
      record.artist.toLowerCase().includes(s) ||
      record.title.toLowerCase().includes(s) ||
      record.label.toLowerCase().includes(s)
    );
  }

  if (params['offset'] === null) {
    params['offset'] = Math.floor(Math.random() * filteredData.length);
  }
  let end = params['offset'] + params['items'];
  let slicedData = filteredData.slice(params['offset'], end);

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
      let t = document.getElementById('text');
      t.textContent = "tessellates";
      params['folder'] = folder;
      params['offset'] = 0;
      renderCanvas(canvas, tess, vinylData, params);
    }
  });
}

function addFilterInteraction(elementId, eventType, filterStringElementId) {
    document.getElementById(elementId).addEventListener(eventType, function(e) {
      if (eventType === "keypress" && e.key !== "Enter") {
        return;
      }
      if (!uiState.bigImage.isShowing) {
        let searchString = document.getElementById(filterStringElementId).value;
        if (searchString.length > 0) {
          params['filter'] = searchString;
          params['offset'] = 0;
        } else {
          params['filter'] = undefined;
          params['offset'] = 0;
        }
        renderCanvas(canvas, tess, vinylData, params);
      }
    });
}


// ---- Entrypoint is here:

var vinylData = [];
var uiState = {
  hasPreloaded: false,
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
params = parseTessellatesParams(params, tess)
var canvas = null;

window.addEventListener("load", (event) => {
  canvas = new fabric.Canvas('vinylCanvas');
  canvas.hoverCursor = 'default';
  var tempData = []
  for (let i = 0; i < tess.defaultItems; i++) {
    tempData.push({});
  }
  tempData = tess.prepare(tempData);
  console.log(tempData);

  for (let i = 0; i < tempData.length; i++) {
    const record = tempData[i];
    const radius = tess.preloadRadius;
    let circle = new fabric.Circle({radius: radius, left: record.imageX - radius, top: record.imageY - radius});
    let gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: 0, y2: circle.height },
      colorStops:[
        { offset: 0, color: "#000"},
        { offset: 1, color: "#FFF"}
      ]
    });
    circle.set('fill', gradient)
    canvas.add(circle);
  }
});




// To my surprise, this looks in folder it is importing to,
// so this will load vinyl/ or digital/, which is what we want!
fetch('release_source.json')
  .then(response => response.json())
  .then(data => {
    vinylData = data;
    renderCanvas(canvas, tess, vinylData, params)

    addPagingClick("back-small", tess.paging.small * -1);
    addPagingClick("back-medium", tess.paging.medium * -1);
    addPagingClick("back-big", tess.paging.big * -1);
    addPagingClick("forward-small", tess.paging.small);
    addPagingClick("forward-medium", tess.paging.medium);
    addPagingClick("forward-big", tess.paging.big);

    addFilterInteraction("filter-input", "keypress", "filter-input");
    addFilterInteraction("filter-submit", "click", "filter-input");

    // If we have folders, add some folder filters!
    // This will be vinyl only for some time, I am sure.
    let testItem = vinylData[0];
    if (testItem.folder !== undefined) {
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
    }
  });
