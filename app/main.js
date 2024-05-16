function renderCanvas(canvas, tess, data, params) {
  const start = params['offset'] - params['minOffset'];
  const end = start + tess.defaultItems;
  const previousData = tess.prepare(data.slice(start - params['offsetDelta'], end - params['offsetDelta']));
  const currentData = tess.prepare(data.slice(start, end));
  tess.render(canvas, currentData, previousData, params['offsetDelta']);
}

function addPagingClick(elementId, offsetDelta) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (!uiState.bigImage.isShowing && params['offset'] + offsetDelta >= 0) {
      // draw the canvas, as we have to always have enough to go in either direction
      params['offset'] = Math.max(0, params['offset'] + offsetDelta);
      params['offsetDelta'] = offsetDelta;
      const potentialNewMax = params['offset'] + (tess.defaultItems * 2);
      const potentialNewMin = Math.max(0, params['offset'] - (tess.defaultItems * 2));
      renderCanvas(canvas, tess, releaseData, params);

      if (offsetDelta > 0 && potentialNewMax > params['maxOffset']) {
        const limit = potentialNewMax - params['maxOffset'];
        const queryUrl = buildUrl(apiState, params['maxOffset'], limit, params['filter'], params['folder']);
        fetch(queryUrl)
          .then(response => response.json())
          .then(newReleaseData => {
            params['maxOffset'] = potentialNewMax;
            releaseData = releaseData.concat(newReleaseData)
          });
      } else if (offsetDelta < 0 & potentialNewMin < params['minOffset']) {
        const limit = params['minOffset'] - potentialNewMin;
        const queryUrl = buildUrl(apiState, potentialNewMin, limit, params['filter'], params['folder']);
        fetch(queryUrl)
          .then(response => response.json())
          .then(newReleaseData => {
            params['minOffset'] = potentialNewMin;
            releaseData = newReleaseData.concat(releaseData);
          });
      }
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
      params['minOffset'] = 0;
      params['maxOffset'] = (tess.defaultItems * 2);
      delete params.offsetDelta;
      uiState.needsRefresh = true;

      const queryUrl = buildUrl(apiState,
        params['minOffset'],
        params['maxOffset'] - params['minOffset'],
        params['filter'],
        params['folder']
      );
      fetch(queryUrl)
        .then(response => response.json())
        .then(newReleaseData => {
          releaseData = newReleaseData;
          uiHelper.clearText();
          renderCanvas(canvas, tess, releaseData, params);
        });
    }
  });
}

function buildUrl(apiState, offset, limit, filter, folder) {
  let url = `${apiState.protocol}://${apiState.host}/collections/${apiState.collectionName}?serve_json=true&limit=${limit}&offset=${offset}`;
  if (filter) {
    url = url + `&filter_string=${filter}`;
  }
  if (folder) {
    url = url + `&folder=${folder}`;
  }
  return url;
}

function setRandomView(params) {
  const offset = Math.floor(Math.random() * apiState.approxReleases);
  params['filter'] = undefined;
  params['offset'] = offset;
  params['minOffset'] = offset - tess.defaultItems;
  params['maxOffset'] = offset + (tess.defaultItems * 2);
  delete params.offsetDelta;
  return params;
}


function addRandomInteraction(elementId) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (uiState.bigImage.isShowing) {
      return
    }
    params = setRandomView(params);
    document.getElementById("filter-input").value = "";
    uiState.needsRefresh = true;

    const queryUrl = buildUrl(apiState,
      params['minOffset'],
      params['maxOffset'] - params['minOffset'],
      params['filter'],
      params['folder']
    );
    fetch(queryUrl)
      .then(response => response.json())
      .then(newReleaseData => {
        releaseData = newReleaseData;
        uiHelper.clearText();
        renderCanvas(canvas, tess, releaseData, params)
      });
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
        params['minOffset'] = 0;
        params['maxOffset'] = (tess.defaultItems * 2);
        delete params.offsetDelta;
      } else {
        params = setRandomView(params);
      }

      uiState.needsRefresh = true;
      const queryUrl = buildUrl(apiState,
        params['minOffset'],
        params['maxOffset'] - params['minOffset'],
        params['filter'],
        params['folder']
      );
      fetch(queryUrl)
        .then(response => response.json())
        .then(newReleaseData => {
          releaseData = newReleaseData;
          uiHelper.clearText();
          renderCanvas(canvas, tess, releaseData, params)
        });
    }
  });
}

function addLocalPlaybackClick() {
  document.getElementById("enable-local-playback").addEventListener("click", function(e) {
    console.log("local playback enabled");
    uiState.localPlayback = true;
    document.getElementById("pause-local-playback").disabled = false;
    document.getElementById("clear-local-playback").disabled = false;
  });
}

function addLocalPauseClick() {
  // This appears to work for both pausing and unpausing!
  document.getElementById("pause-local-playback").addEventListener("click", function(e) {
    vlcHelper.pause();
  });
}

function addLocalClearClick() {
  document.getElementById("clear-local-playback").addEventListener("click", function(e) {
    vlcHelper.clearAllTracks();
  });
}

// ---- Entrypoint is here:

var releaseData = [];
var uiState = {
  hasPreloaded: false,
  needRefresh: false,
  preloadedObjects: [],
  closeUpImages: [],
  bigImage: {
    image: null,
    isShowing: false,
    isAnimating: false
  },
  localPlayback: false
};
var apiState = {
  host: null,
  protocol: null,
  collectionName: null,
  approxReleases: null
}
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
  uiHelper.drawPreloadHexagons(canvas, tess, uiState);
});

// Get the host name
// Leaving this unideal thing in,
// as a reminder for when I am hacking on collects
if (window.location.href.includes("localhost")) {
  // apiState.host = "localhost:3000"
  // apiState.protocol = "http"
  apiState.host = "collects.tide-pool.ca"
  apiState.protocol = "https"
} else {
  apiState.host = "collects.tide-pool.ca"
  apiState.protocol = "https"
}

// Pick the collection
if (window.location.href.includes("digital")) {
  apiState.collectionName = "digital";
  apiState.approxReleases = 2925;
} else if (window.location.href.includes("vinyl")) {
  apiState.collectionName = "vinyl";
  apiState.approxReleases = 525;
}

// Load a random view ofthe collection
params = setRandomView(params);
const queryUrl = buildUrl(apiState,
  params['minOffset'],
  params['maxOffset'] - params['minOffset'],
  params['filter'],
  params['folder']
);

fetch(queryUrl)
  .then(response => response.json())
  .then(data => {
    releaseData = data;
    renderCanvas(canvas, tess, releaseData, params)

    addPagingClick("back-small", tess.paging.small * -1);
    addPagingClick("back-medium", tess.paging.medium * -1);
    addPagingClick("back-big", tess.paging.big * -1);
    addPagingClick("forward-small", tess.paging.small);
    addPagingClick("forward-medium", tess.paging.medium);
    addPagingClick("forward-big", tess.paging.big);

    addFilterInteraction("filter-input", "keypress", "filter-input");
    addFilterInteraction("filter-submit", "click", "filter-input");
    addFilterInteraction("filter-submit", "keypress", "filter-input");
    addRandomInteraction("random", "click");

    // If we have folders, add some folder filters!
    let testItem = releaseData[0];
    if (testItem.folder) {
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
      addLocalPlaybackClick();
      addLocalPauseClick();
      addLocalClearClick();
    }
  });
