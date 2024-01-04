function renderCanvas(canvas, tess, data, params) {
  let folder = params['folder'];
  let filteredData = data;

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
  // because of the strange things that happen when we add Fabric info to the `record` object,
  // we have to do tess.prepare in this order.  Better would be to deep-copy these subsets, but this does not work!
  // A great first thing to do to get to V 0.1.1 will be to fix this
  let previousData = tess.prepare(filteredData.slice(params['offset'] - params['offsetDelta'], end - params['offsetDelta']));
  let currentData = tess.prepare(filteredData.slice(params['offset'], end));
  tess.render(canvas, currentData, previousData, params['offsetDelta']);
}

function addPagingClick(elementId, offsetDelta) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (!uiState.bigImage.isShowing) {
      params['offset'] = Math.max(0, params['offset'] + offsetDelta);
      params['offsetDelta'] = offsetDelta;
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
      uiState.hasPreloaded = false;
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
  preloadedObjects: [],
  closeUpImages: [],
  currentRecord: null,
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

  for (let i = 0; i < tempData.length; i++) {
    const record = tempData[i];
    const radius = tess.preloadRadius;
    const hexPoints = uiHelper.getHexPoints(radius);
    const hex = new fabric.Polygon(hexPoints, {left: record.imageX - radius, top: record.imageY - radius});
    const gradient = uiHelper.getGradient("#000","#FFF", hex.height);
    hex.set('fill', gradient)
    const timeout = Math.floor(Math.random() * 3000) + 250;
    canvas.add(hex);
      setTimeout(() => {
        animationHelper.makeSmallBounceRaw(hex, {})();
      }, timeout);
    uiState.preloadedObjects.push(hex); // I don't love the parallel lists here, but maybe it is OK?
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
    } else {

      // let's add playback!
      // I don't love that we have to set the currentRecord globally to put this here,
      // it is worth setting up this function when we click to "load" the record!
      document.getElementById("play-current").addEventListener("click", function(e) {
        if (uiState.bigImage.isShowing) {
          const tracks = uiState.currentRecord.tracks;

          for (let i = 0; i < tracks.length; i++) {
            // const filepath = encodeURIComponent(tracks[i].filepath);
            // const url = vlcUrl + filepath;
            const vlcUrl = "http://127.0.0.1:8089/requests/status.xml?command=in_play&input=/Users/thor/Desktop/Overmono%20-%20Blow%20Out.flac";
            const headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa("" + ":" + "wombat"));
            console.log(vlcUrl, headers);
            fetch(vlcUrl, {headers: headers}).then(response => response.text()).then(text => console.log(text));
            break;
          }
        }
      });


    }
  });
