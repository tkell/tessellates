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

  // Phase 1: Fade out old records
  renderHelper._fadeOutOldRecords(data, previousData, paginationOffset, numRecordsToRemove);

  // Phase 2: Move all records to new positions
  renderHelper._moveRecordsToNewPositions(data, previousData, paginationOffset, tessellation);

  // Phase 3: After animations complete, re-initialize everything with new data
  setTimeout(() => {
    renderHelper._addStartingStates(data, tessellation);
    imageHelper.loadImages(data)
      .then(() => imageHelper.clearGrid())
      .then(() => imageHelper.addImagesInstantly(data, tessellation))
      .then(() => {
        // Fade in the new records that were added
        for (let i = 0; i < numRecordsToRemove; i++) {
          const index = paginationOffset < 0 ? i : data.length - 1 - i;
          const newRecordToFadeIn = data[index];
          if (newRecordToFadeIn && newRecordToFadeIn.imageItem) {
            newRecordToFadeIn.imageItem.style.opacity = '0';
            uiHelper.fadeInRecord(newRecordToFadeIn)
              .then(() => {
                newRecordToFadeIn.imageItem.style.opacity = '';
              });
          }
        }
      })
      .then(() => {
        for (let i = 0; i < data.length; i++) {
          uiHelper.setupEventListeners(data[i], data);
        }
      })
      .then(() => {
        // Re-add ambient animations
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
      uiHelper.fadeOutRecord(oldRecordToFadeOut)
      .then(() => {
        oldRecordToFadeOut.imageItem.style.visibility = "hidden";
      })
    }
  }
};

/**
 * Move all records (both visible and faded-out) to their new positions for pagination
 * @param {Array} newData - New data array
 * @param {Array} previousData - Previous data array
 * @param {number} paginationOffset - Pagination offset
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._moveRecordsToNewPositions = function(newData, previousData, paginationOffset, tessellation) {
  for (let i = 0; i < previousData.length; i++) {
    const oldRecord = previousData[i];
    if (oldRecord && oldRecord.imageItem) {
      // Calculate where this record should move to
      let targetGridIndex;

      if (paginationOffset > 0) {
        // Forward pagination: records shift left by paginationOffset positions
        targetGridIndex = i - paginationOffset;
      } else {
        // Backward pagination: records shift right by abs(paginationOffset) positions
        targetGridIndex = i + Math.abs(paginationOffset);
      }

      // If target position is within bounds, move there
      if (targetGridIndex >= 0 && targetGridIndex < newData.length) {
        renderHelper._moveRecordToGridPosition(oldRecord, targetGridIndex, tessellation, paginationOffset);
      }
    }
  }
};

/**
 * Move a record's DOM element to a new grid position using CSS transforms
 * @param {Object} record - Record to move
 * @param {number} newGridIndex - New index in the grid
 * @param {Object} tessellation - Tessellation configuration
 */
renderHelper._moveRecordToGridPosition = function(record, newGridIndex, tessellation, paginationOffset) {
  /*
   * So if we're rhombus, we compute our paginationOffset, by doing record.index - newGridIndex
   * And we can find which triplet the record is in, by Math.floo(record.index / 8)
   * We can make a _map_, for each pagination offset, that maps the motion per-triplet
   * e.g. {0: {x: 344, y:0}} - and then we just index into the damn map!
   * (but tomorrow, tomorrow, we'll code this tomorrow)
   */
  if (tessellation.type === 'rhombus') {
    var motionMap = {}
    if (paginationOffset === 3) {
      // just +3 for now, so each index is the triplet index
      motionMap = {
        0: {x: 0, y: 0}, // fades out
        1: {x: [-333, -333, -333], y: [192, 0, 192]}, // one left
        2: {x: [-333, -333, -333], y: [192, 0, 192]},
        //
        3: {x: [500, 500, 500], y: [-105, -297, -105]}, // one and a half right and one up
        4: {x: [-333, -333, -333], y: [192, 0, 192]},
        //
        5: {x: [499, 499, 499], y: [-105, -297, -105]},
        6: {x: [-333, -333, -333], y: [192, 0, 192]},
        7: {x: [-333, -333, -333], y: [192, 0, 192]}
      }
    } else if (paginationOffset === -3) {
      motionMap = {
        0: {x: [333, 333, 333], y: [192, 0, 192]}, // one right
        1: {x: [333, 333, 333], y: [192, 0, 192]},
        2: {x: [-500, -500, -500], y: [489, 297, 489]}, // one and a half left and one down
        //
        3: {x: [333, 333, 333], y: [192, 0, 192]}, // one right
        4: {x: [-500, -500, -500], y: [489, 297, 489]}, // one and a half left and one down
        //
        5: {x: [333, 333, 333], y: [192, 0, 192]},
        6: {x: [333, 333, 333], y: [192, 0, 192]},
        7: {x: 0, y: 0}, // fades out
      }
    } else if (paginationOffset === 9) {
      motionMap = {
        0: {x: 0, y: 0}, // fades out
        1: {x: 0, y: 0}, // fades out
        2: {x: 0, y: 0}, // fades out
        //
        3: {x: [-166, -166, -166], y: [-105, -297, -105]}, // one-half left and one up
        4: {x: [-166, -166, -166], y: [-105, -297, -105]}, // one-half left and one up
        //
        5: {x: [666, 666, 666], y: [-402, -594, -402]}, //  two right and two up
        6: {x: [-167, -167, -167], y: [-105, -297, -105]}, // one-half left and one up
        7: {x: [-167, -167, -167], y: [-105, -297, -105]}, // one-half left and one up
      }
    } else if (paginationOffset === -9) {
      motionMap = {
        0: {x: [166, 166, 166], y: [489, 297, 489]}, // one-half right and one down
        1: {x: [166, 166, 166], y: [489, 297, 489]}, // one-half right and one down
        2: {x: [-666, -666, -666], y: [786, 594, 786]}, // two left and two down
        //
        3: {x: [166, 166, 166], y: [489, 297, 489]}, // one-half right and one down
        4: {x: [166, 166, 166], y: [489, 297, 489]}, // one-half right and one down
        //
        5: {x: 0, y: 0}, // fades out
        6: {x: 0, y: 0}, // fades out
        7: {x: 0, y: 0}, // fades out
      }
    }

    let triplet = Math.floor(record.index / 3) 
    let tuplet = Math.floor(record.index % 3) 
    xOffset = motionMap[triplet].x[tuplet]
    yOffset = motionMap[triplet].y[tuplet]
    if (xOffset !== 0 || yOffset !== 0) {
      record.imageItem.style.transition = 'transform 725ms ease-in-out';
      record.imageItem.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
    return;
  } else if (tessellation.type === 'square' || tessellation.type === 'triangle') {
    // Get grid configuration for this tessellation type
    let columns, itemSizeX, itemSizeY;

    if (tessellation.type === 'square') {
      columns = Math.sqrt(tessellation.defaultItems);
      itemSizeX = itemSizeY = 1000 / columns; // var(--grid-size) / var(--grid-columns)
    } else if (tessellation.type === 'triangle') {
      columns = 9; // Triangle tessellation uses 9 columns
      itemSizeX = itemSizeY = 200; // Each triangle cell is 200px × 200px
    }

    // Calculate current and new positions in the grid
    const currentIndex = record.index;
    const newRow = Math.floor(newGridIndex / columns);
    const newCol = newGridIndex % columns;
    const currentRow = Math.floor(currentIndex / columns);
    const currentCol = currentIndex % columns;

    // Calculate pixel offsets based on grid cell size
    let xOffset = (newCol - currentCol) * itemSizeX;
    let yOffset = (newRow - currentRow) * itemSizeY;

    // Account for tessellation-specific margin offsets
    if (tessellation.type === 'triangle') {
      const currentMargin = -(currentCol * 100); // Current CSS margin offset
      const newMargin = -(newCol * 100); // New CSS margin offset
      const marginDelta = newMargin - currentMargin; // Difference in margin
      xOffset += marginDelta; // Add margin difference to our transform
    }
    record.imageItem.style.transition = 'transform 725ms ease-in-out';
    record.imageItem.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

  } else if (tessellation.type === 'circle') {
    // Update circle position class with smooth transition
    record.imageItem.style.transition = 'transform var(--animation-duration-slow) ease-in-out';
    record.imageItem.className = record.imageItem.className.replace(/circle-item-\d+/, `circle-item-${newGridIndex % 12}`);
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
    // Assign circle position class based on index
    record.positionClass = `circle-item-${record.index % 12}`;
  } else if (tessellation.type === 'triangle') {
    record.bigClipPathClass = 'shape-square';
    // Use angle to determine triangle orientation and positioning
    if (record.angle === 180) {
      record.clipPathClass = 'shape-triangle-inverted';
      record.positionClass = 'triangle-down';
    } else {
      record.clipPathClass = 'shape-triangle';
      record.positionClass = 'triangle-up';
    }
  } else if (tessellation.type === 'rhombus') {
    record.clipPathClass = 'shape-rhombus';
    record.bigClipPathClass = 'shape-square-rhombus';
    let positionClasses = [`rhombus-${record.rhombusType}`];
    record.positionClass = positionClasses.join(' ');
  } else {
    record.clipPathClass = 'shape-square';
    record.bigClipPathClass = 'shape-square';
    record.positionClass = '';
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
      .then(() => uiHelper.waitFor(tessellation.timeouts.fast))
      .then(() => uiHelper.loadBigImage(record))
      .then(() => uiHelper.replaceCloseUpImage(record, data, tessellation.timeouts.slow))
      .then(() => {
        const bigImageContainer = document.getElementById('big-image-container');
        bigImageContainer.classList.add('active');
        uiState.bigImage.isAnimating = false;
      })
      .then(() => uiHelper.waitFor(tessellation.timeouts.slow))
      .then(() => uiHelper.hideCloseUpImages(record, data))
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
