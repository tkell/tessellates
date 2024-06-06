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
        const queryUrl = buildUrl(apiState, params['maxOffset'], limit, params);
        fetch(queryUrl)
          .then(response => response.json())
          .then(newReleaseData => {
            params['maxOffset'] = potentialNewMax;
            releaseData = releaseData.concat(newReleaseData)
          });
      } else if (offsetDelta < 0 & potentialNewMin < params['minOffset']) {
        const limit = params['minOffset'] - potentialNewMin;
        const queryUrl = buildUrl(apiState, potentialNewMin, limit, params);
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
  const element = document.getElementById(elementId);
  element.addEventListener("click", function(e) {
    if (element === uiState.currentFolderElement || uiState.bigImage.isShowing) {
      return;
    }

    let t = document.getElementById('text');
    t.textContent = "tessellates";
    params['folder'] = folder;
    params['offset'] = 0;
    params['minOffset'] = 0;
    params['maxOffset'] = (tess.defaultItems * 2);
    delete params.offsetDelta;
    uiState.needsRefresh = true;

    if (folder !== false) {
      if (uiState.currentFolderElement) {
        uiState.currentFolderElement.classList.remove("emoji-button-selected");
        uiState.currentFolderElement.classList.add("emoji-button");
        uiState.currentFolderElement.disabled = false;
      }
      element.classList.remove("emoji-button");
      element.classList.add("emoji-button-selected");
      element.disabled = true;
      uiState.currentFolderElement = element;
    } else {
      uiState.currentFolderElement.classList.remove("emoji-button-selected");
      uiState.currentFolderElement.classList.add("emoji-button");
      uiState.currentFolderElement.disabled = false;
      uiState.currentFolderElement = null;
      params = setRandomView(params);
    }

    const queryUrl = buildUrl(apiState,
      params['minOffset'],
      params['maxOffset'] - params['minOffset'],
      params
    );
    fetch(queryUrl)
      .then(response => response.json())
      .then(newReleaseData => {
        releaseData = newReleaseData;
        uiHelper.clearText();
        renderCanvas(canvas, tess, releaseData, params);
      });
  });
}

function buildUrl(apiState, offset, limit, params) {
  const filter = params['filter'] || undefined;
  const folder = params['folder'] || undefined;
  const releaseYear = params['releaseYear'] || undefined;
  const sort = params['sort'] || undefined;

  let url = `${apiState.protocol}://${apiState.host}/collections/${apiState.collectionName}?serve_json=true&limit=${limit}&offset=${offset}`;
  if (filter) {
    url = url + `&filter_string=${filter}`;
  }
  if (folder) {
    url = url + `&folder=${folder}`;
  }
  if (releaseYear) {
    url = url + `&release_year=${releaseYear}`;
  }
  if (sort) {
    url = url + `&sort=${sort}`;
  }
  return url;
}

function setRandomView(params) {
  const offset = Math.floor(Math.random() * apiState.approxReleases);
  params['filter'] = undefined;
  params['releaseYear'] = undefined;
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
      params
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

function updateParamsOnKeypress(elementId, paramsField) {
  document.getElementById(elementId).addEventListener("keyup", function(e) {
    if (e.target.value === "") {
      delete params[paramsField];
    } else
    if (paramsField === "releaseYear") {
      const re = /^\d{4}(?:\s*-\s*\d{4})?$/
      if (re.test(e.target.value)) {
        params[paramsField] = e.target.value;
      }
    } else if (paramsField === "sort") {
      const re = /^[atyl]{0,4}$/
      if (re.test(e.target.value)) {
        params[paramsField] = e.target.value;
      }
    }
    else {
      params[paramsField] = e.target.value;
    }
  });
}

function addFilterInteraction(elementId, eventType) {
  document.getElementById(elementId).addEventListener(eventType, function(e) {
    if (eventType === "keypress" && e.key !== "Enter") {
      return;
    }
    if (!uiState.bigImage.isShowing) {
      if ((params['filter'] && params['filter'].length > 0) || (params['releaseYear'] && params['releaseYear'].length > 0)) {
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
        params
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
  localPlayback: false,
  currentFolderElement: null
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
  apiState.approxReleases = 3001;
} else if (window.location.href.includes("vinyl")) {
  apiState.collectionName = "vinyl";
  apiState.approxReleases = 525;
}

// Load a random view ofthe collection
params = setRandomView(params);
const queryUrl = buildUrl(apiState,
  params['minOffset'],
  params['maxOffset'] - params['minOffset'],
  params
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

    updateParamsOnKeypress('release-year-input', 'releaseYear');
    updateParamsOnKeypress('filter-input', 'filter');
    updateParamsOnKeypress('sort-input', 'sort');

    addFilterInteraction("filter-input", "keypress");
    addFilterInteraction("release-year-input", "keypress");
    addFilterInteraction("filter-submit", "click");
    addFilterInteraction("filter-submit", "keypress");
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
