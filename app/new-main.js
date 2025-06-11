/**
 * Main application file
 */

/**
 * Render the tessellation with the given data
 * @param {Object} tess - Tessellation configuration object
 * @param {Array} data - Array of record objects
 * @param {Object} params - Parameters for rendering
 */
function renderTessellation(tess, data, params) {
  const start = params['offset'] - params['minOffset'];
  const end = start + tess.defaultItems;
  const previousData = tess.prepare(data.slice(start - params['offsetDelta'], end - params['offsetDelta']));
  const currentData = tess.prepare(data.slice(start, end));
  tess.render(currentData, previousData, params['offsetDelta']);
}

/**
 * Add click handlers for pagination
 * @param {string} elementId - Element ID for the pagination button
 * @param {number} offsetDelta - Amount to change offset
 */
function addPagingClick(elementId, offsetDelta) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (!uiState.bigImage.isShowing && params['offset'] + offsetDelta >= 0) {
      // Update paging parameters
      params['offset'] = Math.max(0, params['offset'] + offsetDelta);
      params['offsetDelta'] = offsetDelta;
      const potentialNewMax = params['offset'] + (tess.defaultItems * 2);
      const potentialNewMin = Math.max(0, params['offset'] - (tess.defaultItems * 2));
      
      // Render the grid with updated data
      renderTessellation(tess, releaseData, params);

      // Load more data if needed
      if (offsetDelta > 0 && potentialNewMax > params['maxOffset']) {
        const limit = potentialNewMax - params['maxOffset'];
        const queryUrl = buildUrl(apiState, params['maxOffset'], limit, params);
        fetch(queryUrl)
          .then(response => response.json())
          .then(newReleaseData => {
            params['maxOffset'] = potentialNewMax;
            releaseData = releaseData.concat(newReleaseData);
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

/**
 * Add click handlers for folder selection
 * @param {string} elementId - Element ID for the folder button
 * @param {string} folder - Folder name or false for all
 */
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
        renderTessellation(tess, releaseData, params);
      });
  });
}

/**
 * Build a URL for the API request
 * @param {Object} apiState - API state object
 * @param {number} offset - Offset for API request
 * @param {number} limit - Limit for API request
 * @param {Object} params - Parameters for the request
 * @returns {string} - Constructed URL
 */
function buildUrl(apiState, offset, limit, params) {
  const filter = params['filter'] || undefined;
  const folder = params['folder'] || undefined;
  const releaseYear = params['releaseYear'] || undefined;
  const purchaseDate = params['purchaseDate'] || undefined;
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
  if (purchaseDate) {
    url = url + `&purchase_date=${purchaseDate}`;
  }
  if (sort) {
    url = url + `&sort=${sort}`;
  }
  return url;
}

/**
 * Set random view parameters
 * @param {Object} params - Current parameters
 * @returns {Object} - Updated parameters
 */
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

/**
 * Add collection flip handler
 * @param {string} elementId - Element ID for the button
 */
function addCollectionFlip(elementId) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (uiState.bigImage.isShowing) {
      return;
    }

    let nextName = "vinyl";
    if (apiState.collectionName === "vinyl") {
      nextName = "digital";
    }
    const url = `https://tide-pool.ca/tessellates/${nextName}?t=${params['t']}`;
    window.location.href = url;
  });
}

/**
 * Add random view interaction
 * @param {string} elementId - Element ID for the button
 */
function addRandomInteraction(elementId) {
  document.getElementById(elementId).addEventListener("click", function(e) {
    if (uiState.bigImage.isShowing) {
      return;
    }
    params = setRandomView(params);
    document.getElementById("release-year-input").value = "";
    document.getElementById("purchase-date-input").value = "";
    document.getElementById("filter-input").value = "";
    document.getElementById("sort-input").value = "";
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
        renderTessellation(tess, releaseData, params);
      });
  });
}

/**
 * Update parameters on keypress
 * @param {string} elementId - Element ID for the input
 * @param {string} paramsField - Field in params to update
 */
function updateParamsOnKeypress(elementId, paramsField) {
  document.getElementById(elementId).addEventListener("keyup", function(e) {
    if (e.target.value === "") {
      delete params[paramsField];
    } else
    if (paramsField === "releaseYear" || paramsField === "purchaseDate") {
      const re = /^\d{4}(?:\s*-\s*\d{4})?$/;
      if (re.test(e.target.value)) {
        params[paramsField] = e.target.value;
      }
    } else if (paramsField === "sort") {
      const re = /^[atylp]{0,4}$/;
      if (re.test(e.target.value)) {
        params[paramsField] = e.target.value;
      }
    }
    else {
      params[paramsField] = e.target.value;
    }
  });
}

/**
 * Check if any filter parameters are set
 * @param {Object} params - Parameters object
 * @returns {boolean} - True if any filter parameter is set
 */
function filterParamsAreSet(params) {
  const hasFilter = params['filter'] && params['filter'].length > 0;
  const hasReleaseYear = params['releaseYear'] && params['releaseYear'].length > 0;
  const hasPurchaseDate = params['purchaseDate'] && params['purchaseDate'].length > 0;
  const hasSort = params['sort'] && params['sort'].length > 0;

  return (hasFilter || hasReleaseYear || hasPurchaseDate || hasSort);
}

/**
 * Add filter interaction
 * @param {string} elementId - Element ID for the button or input
 * @param {string} eventType - Event type (click or keypress)
 */
function addFilterInteraction(elementId, eventType) {
  document.getElementById(elementId).addEventListener(eventType, function(e) {
    if (eventType === "keypress" && e.key !== "Enter") {
      return;
    }
    if (!uiState.bigImage.isShowing) {
      if (filterParamsAreSet(params)) {
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
          renderTessellation(tess, releaseData, params);
        });
    }
  });
}

/**
 * Add local playback enable button
 */
function addLocalPlaybackClick() {
  const enableButton = document.getElementById("enable-local-playback");
  if (enableButton) {
    enableButton.addEventListener("click", function(e) {
      console.log("local playback enabled");
      uiState.localPlayback = true;
      
      const pauseButton = document.getElementById("pause-local-playback");
      if (pauseButton) pauseButton.disabled = false;
      
      const clearButton = document.getElementById("clear-local-playback");
      if (clearButton) clearButton.disabled = false;
    });
  }
}

/**
 * Add local playback pause button
 */
function addLocalPauseClick() {
  const pauseButton = document.getElementById("pause-local-playback");
  if (pauseButton) {
    pauseButton.addEventListener("click", function(e) {
      vlcHelper.pause();
    });
  }
}

/**
 * Add local playback clear button
 */
function addLocalClearClick() {
  const clearButton = document.getElementById("clear-local-playback");
  if (clearButton) {
    clearButton.addEventListener("click", function(e) {
      vlcHelper.clearAllTracks();
    });
  }
}

/**
 * Add login interaction
 * @param {string} elementId - Element ID for the button or input
 * @param {string} eventType - Event type (click or keypress)
 */
function addLoginInteraction(elementId, eventType) {
  document.getElementById(elementId).addEventListener(eventType, async (e) => {
    if (eventType === "keypress" && e.key !== "Enter") {
      return;
    }
    const email = document.getElementById('login-input').value;
    const password = document.getElementById('password-input').value;

    try {
      const url= `${apiState.protocol}://${apiState.host}/login`;
      console.log(url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // need this for cookies
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const expires_at = new Date(data.expires_at);
      const username = data.username;
      document.cookie = `loggedInUser=${username}; expires=${expires_at.toUTCString()}; path=/`;
      displayLogin();
    } catch (error) {
      console.error('Login error:', error);
    }
  });
}

/**
 * Display login-related UI elements if logged in
 */
function displayLogin() {
  if (checkCookieExistence('loggedInUser')) {
    document.getElementById('annotation-span').style.visibility = 'visible';
    document.getElementById('login-input').disabled = true;
    document.getElementById('password-input').disabled = true;
    document.getElementById('login-submit').disabled = true;
    const playbackDiv = document.getElementById('playback-div');
    if (playbackDiv) {
      playbackDiv.style.visibility = 'visible';
    }
  }
}

/**
 * Check if a cookie exists
 * @param {string} cookie_name - Name of the cookie to check
 * @returns {boolean} - True if cookie exists
 */
function checkCookieExistence(cookie_name) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const name = cookies[i].split('=')[0].trim();
    if (name === cookie_name) {
      return true;
    }
  }
  return false;
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
};
var params = getSearchParameters();

// Pick a tessellation
let tess = null;
if (params['t'] == 'square') {
  tess = makeSquare();
} else if (params['t']== 'rhombus') {
  tess = makeRhombus();
} else if (params['t']== 'triangle') {
  tess = makeTriangle();
} else if (params['t']== 'circle') {
  tess = makeCircle();
} else {
  let random = Math.floor(Math.random() * 4);
  if (random == 0) {
    tess = makeSquare();
    params['t'] = 'square';
  } else if (random == 1) {
    tess = makeRhombus();
    params['t'] = 'rhombus';
  } else if (random == 2) {
    tess = makeTriangle();
    params['t'] = 'triangle';
  } else {
    tess = makeCircle();
    params['t'] = 'circle';
  }
}
params = parseTessellatesParams(params, tess);

// Initialize on window load
window.addEventListener("load", (event) => {
  // Draw preload hexagons
  uiHelper.drawPreloadHexagons(tess);
  
  // Set up login handlers
  addLoginInteraction("password-input", "keypress");
  addLoginInteraction("login-submit", "keypress");
  addLoginInteraction("login-submit", "click");
  displayLogin();
});

// Set up API state
// Leaving this unideal thing in,
// as a reminder for when I am hacking on collects
if (window.location.href.includes("localhost")) {
  apiState.host = "localhost:3000";
  apiState.protocol = "http";
  // apiState.host = "collects.tide-pool.ca"
  // apiState.protocol = "https"
} else {
  apiState.host = "collects.tide-pool.ca";
  apiState.protocol = "https";
}

// Pick the collection
if (window.location.href.includes("digital")) {
  apiState.collectionName = "digital";
  apiState.approxReleases = 3001;
} else if (window.location.href.includes("vinyl")) {
  apiState.collectionName = "vinyl";
  apiState.approxReleases = 525;
}

// Load a random view of the collection
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
    renderTessellation(tess, releaseData, params);
    
    // Set up interaction handlers
    addPagingClick("back-small", tess.paging.small * -1);
    addPagingClick("back-medium", tess.paging.medium * -1);
    addPagingClick("back-big", tess.paging.big * -1);
    addPagingClick("forward-small", tess.paging.small);
    addPagingClick("forward-medium", tess.paging.medium);
    addPagingClick("forward-big", tess.paging.big);

    updateParamsOnKeypress('release-year-input', 'releaseYear');
    updateParamsOnKeypress('purchase-date-input', 'purchaseDate');
    updateParamsOnKeypress('filter-input', 'filter');
    updateParamsOnKeypress('sort-input', 'sort');

    addFilterInteraction("release-year-input", "keypress");
    addFilterInteraction("purchase-date-input", "keypress");
    addFilterInteraction("filter-input", "keypress");
    addFilterInteraction("sort-input", "keypress");
    addFilterInteraction("filter-submit", "click");
    addFilterInteraction("filter-submit", "keypress");
    addRandomInteraction("random");
    addCollectionFlip("collection-flip");

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
