/**
 * New render helpers to replace fabric.js rendering with standard HTML/CSS
 */
let renderHelper = {};

/**
 * Main render function that decides between new load and move load
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 * @param {Array} previousData - Previous data (for pagination)
 * @param {number} paginationOffset - Offset for pagination
 */
renderHelper.render = function(data, tessellation, previousData, paginationOffset) {
  if (!uiState.hasPreloaded || uiState.needsRefresh) {
    renderHelper._newLoad(data, tessellation);
  } else {
    renderHelper._moveLoad(data, tessellation, previousData, paginationOffset);
  }
};

/**
 * Handle new load of data
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._newLoad = function(data, tessellation) {
  // Clear any tracks and UI first
  uiHelper.clearTrack();
  
  // Chain of tasks for loading
  Promise.resolve()
    .then(() => renderHelper._addStartingStates(data, tessellation))
    .then(() => imageHelper.loadImages(data))
    .then(() => uiHelper.waitFor(100))
    .then(() => imageHelper.renderImageGridAndPreview(data, tessellation))
    .then(() => uiHelper.waitFor(1000))
    .then(() => imageHelper.addImages(data, tessellation))
    .then(() => {
      // Set up event handlers for each item
      for (let i = 0; i < data.length; i++) {
        uiHelper.setupEventListeners(data[i], data);
      }
      // Add ambient animations
      renderHelper._addAmbientAnimations(data, tessellation);
      
      // Add bounce effect after everything is loaded
      setTimeout(() => {
        for (let i = 0; i < data.length; i++) {
          uiHelper.bounceRecordSmall(data[i]);
        }
      }, 500);
    });

  uiState.hasPreloaded = true;
  uiState.needsRefresh = false;
};

/**
 * Handle moving/paginating data
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 * @param {Array} previousData - Previous data (for pagination)
 * @param {number} paginationOffset - Offset for pagination
 */
renderHelper._moveLoad = function(data, tessellation, previousData, paginationOffset) {
  const numRecordsToRemove = Math.abs(paginationOffset);
  const numRecordsToKeep = data.length - Math.abs(paginationOffset);
  
  // Fade out records that will be removed
  renderHelper._fadeOutOldRecords(data, previousData, paginationOffset, numRecordsToRemove);
  
  // Prepare data and load images
  setTimeout(() => {
    renderHelper._addStartingStates(data, tessellation);
    
    imageHelper.loadImages(data)
      .then(() => {
        // Re-render the grid with new data
        imageHelper.renderImageGrid(data, tessellation);
        
        // Set up event handlers for each item
        for (let i = 0; i < data.length; i++) {
          uiHelper.setupEventListeners(data[i], data);
        }
        
        // Fade in the new records
        for (let i = 0; i < numRecordsToRemove; i++) {
          const index = paginationOffset < 0 ? i : data.length - 1 - i;
          uiHelper.fadeInRecord(data[index]);
        }
        
        // Add ambient animations
        renderHelper._addAmbientAnimations(data, tessellation);
      });
  }, 1200);
};

/**
 * Fade out old records that will be removed during pagination
 * @param {Array} data - New data array
 * @param {Array} previousData - Previous data array
 * @param {number} paginationOffset - Pagination offset
 * @param {number} numRecordsToRemove - Number of records to remove
 */
renderHelper._fadeOutOldRecords = function(data, previousData, paginationOffset, numRecordsToRemove) {
  for (let i = 0; i < numRecordsToRemove; i++) {
    const index = paginationOffset > 0 ? i : previousData.length - 1 - i;
    const oldRecordToFadeOut = previousData[index];
    if (oldRecordToFadeOut) {
      uiHelper.fadeOutRecord(oldRecordToFadeOut);
    }
  }
};

/**
 * Set up initial states for records
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._addStartingStates = function(data, tessellation) {
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    renderHelper._addStartingStateToRecord(record, i, tessellation);
    renderHelper._setMouseListeners(record, data, tessellation);
  }
};

/**
 * Add starting state to a single record
 * @param {Object} record - Record object
 * @param {number} index - Index in the data array
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._addStartingStateToRecord = function(record, index, tessellation) {
  record.index = index;
  record.nextTrackToShow = 0;
  record.isAnimating = false;

  if (record.currentVariant === undefined) {
    record.currentVariant = record.variants.find(variant => variant.id === record.current_variant_id);
  }
  
  record.imagePath = record.currentVariant.image_path;
  let imageFileName = record.currentVariant.image_path.slice(0, -4);
  record.smallImagePath = imageFileName + "-small.jpg";

  // Assign shape class based on tessellation type
  if (tessellation.type === 'circle') {
    record.clipPathClass = 'shape-circle';
    record.bigClipPathClass = 'shape-circle';
  } else if (tessellation.type === 'triangle') {
    record.clipPathClass = 'shape-triangle';
    record.bigClipPathClass = 'shape-triangle';
  } else if (tessellation.type === 'rhombus') {
    record.clipPathClass = 'shape-rhombus';
    record.bigClipPathClass = 'shape-rhombus';
  } else {
    record.clipPathClass = 'shape-square';
    record.bigClipPathClass = 'shape-square';
  }
  
  // Set up animation choices based on record ID
  let directionId = Math.floor(record.external_id / 100) % 2;
  let timeoutIndex = record.external_id % tessellation.timeoutFunctions.length;
  if (directionId === 0) {
    record.timeoutFunction = tessellation.timeoutFunctions[timeoutIndex][0];
    record.reverseTimeoutFunction = tessellation.timeoutFunctions[timeoutIndex][1];
  } else {
    record.timeoutFunction = tessellation.timeoutFunctions[timeoutIndex][1];
    record.reverseTimeoutFunction = tessellation.timeoutFunctions[timeoutIndex][0];
  }
};

/**
 * Set up mouse event listeners for a record
 * @param {Object} record - Record object
 * @param {Array} data - Array of all records
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._setMouseListeners = function(record, data, tessellation) {
  record.onMouseOver = function() {
    uiHelper.bounceRecord(record);
    uiHelper.updateTextWithTitle(record);
  };

  record.onMouseDown = function() {
    // Preload full-size image
    imageHelper.preloadImage(record.imagePath);
    
    // Update UI state
    uiState.bigImage.isShowing = true;
    uiState.bigImage.isAnimating = true;
    
    // Update text displays
    uiHelper.updateTextWithArtistAndTitle(record);
    if (uiState.localPlayback) {
      uiHelper.updateTextForLocalPlayback(record);
    }
    uiHelper.updateTextForFocus(record);
    
    // Set up playback functionality
    const play = vlcHelper.makePlayFunc(record);
    record.playFunc = function() {
      apiHelper.logPlayback(record);
      play();
      uiHelper.runBackgroundGradient(record);
    };
    document.getElementById("text").addEventListener("click", record.playFunc);
    
    // Set up links
    const annotationUrl = `${apiState.protocol}://${apiState.host}/releases/${record.id}/annotations`;
    document.getElementById("annotation-link").setAttribute("href", annotationUrl);
    const variantsUrl = `${apiState.protocol}://${apiState.host}/releases/${record.id}/variants`;
    document.getElementById("variants-link").setAttribute("href", variantsUrl);
    
    // Transition to big image view with animation sequence
    uiHelper.replaceOtherRecords(record, data, tessellation.timeouts.slow)
      .then(() => uiHelper.loadBigImage(record))
      .then(() => uiHelper.replaceCloseUpImage(record, data, tessellation.timeouts.slow))
      .then(() => uiHelper.waitFor(tessellation.timeouts.fast))
      .then(() => {
        const bigImageContainer = document.getElementById('big-image-container');
        bigImageContainer.classList.add('active');
        uiState.bigImage.isAnimating = false;
      })
  };

  record.onBigImageClose = function() {
    // Clean up event listeners and text formatting
    document.getElementById("text").removeEventListener("click", record.playFunc);
    if (uiState.localPlayback) {
      uiHelper.resetTextForLocalPlayback(record);
    }
    uiHelper.resetTextForFocus(record);

    // Show original images and animate
    uiState.bigImage.isAnimating = true;
    uiHelper.showExistingImages(data);
    uiHelper.waitFor(1)
      .then(() => uiHelper.removeBigImage())
      .then(() => uiHelper.removeCloseUpImages(record, data, tessellation.timeouts.fast))
      .then(() => uiHelper.restoreOtherRecords(record, data, tessellation.timeouts.slow))
      .then(() => {
        uiState.bigImage.isShowing = false;
        uiState.bigImage.isAnimating = false;
        record.nextTrackToShow = 0;
        uiHelper.clearTrack();
      });
  };
};

/**
 * Select a timeout function from the tessellation's options
 * @param {Object} tessellation - Tessellation configuration
 * @returns {Function} - Selected timeout function
 */
renderHelper._pickTimeout = function(tessellation) {
  const timeoutIndex = Math.floor(Math.random() * tessellation.timeoutFunctions.length);
  const reverseIndex = Math.floor(Math.random() * 2);
  return tessellation.timeoutFunctions[timeoutIndex][reverseIndex];
};

/**
 * Set up ambient animations for all records
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._addAmbientAnimations = function(data, tessellation) {
  const timeoutOffsetMs = 8000;
  const maxTimeoutMs = tessellation.defaultItems * 1000 * 48;
  
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const interval = Math.ceil(Math.random() * maxTimeoutMs) + timeoutOffsetMs;
    
    setInterval(() => {
      uiHelper.ambientAnimate(record);
    }, interval);
  }
};
