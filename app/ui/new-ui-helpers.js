/**
 * New UI helpers to replace fabric.js UI functionality with standard HTML/CSS
 */
let uiHelper = {};

/**
 * Wait for a specified number of milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the wait
 */
uiHelper.waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Text update functions
/**
 * Clear the text display
 */
uiHelper.clearText = function() {
  const t = document.getElementById('text');
  t.textContent = '_';
};

/**
 * Update text with artist and title
 * @param {Object} record - Record object
 */
uiHelper.updateTextWithArtistAndTitle = function(record) {
  const t = document.getElementById('text');
  t.textContent = `${record.artist} - ${record.title} [${record.label}]`;
};

/**
 * Update text with just the title
 * @param {Object} record - Record object
 */
uiHelper.updateTextWithTitle = function(record) {
  if (!uiState.bigImage.isShowing) {
    const t = document.getElementById('text');
    t.textContent = record.title;
  }
};

/**
 * Update text styling for focus
 * @param {Object} record - Record object
 */
uiHelper.updateTextForFocus = function(record) {
  const textElement = document.getElementById("text");
  const gradientString = `linear-gradient(90deg, ${record.currentVariant.colors[0]}, ${record.currentVariant.colors[1]})`;
  textElement.style.backgroundImage = gradientString;
  textElement.style.color = "transparent";
  textElement.style.backgroundClip = "text";
  textElement.style.webkitBackgroundClip = "text"; // For Safari
  
  // Create animation
  const colorFade = [
    {color: record.currentVariant.colors[0]},
    {color: "transparent"},
    {color: record.currentVariant.colors[1]},
    {color: "transparent"},
    {color: record.currentVariant.colors[0]},
  ];
  
  const textAnimation = textElement.animate(colorFade, {
    duration: 6000,
    iterations: 6,
  });
  
  record.textAnimation = textAnimation;
};

/**
 * Reset text styling after focus ends
 * @param {Object} record - Record object
 */
uiHelper.resetTextForFocus = function(record) {
  const textElement = document.getElementById("text");
  textElement.style.backgroundImage = "initial";
  textElement.style.color = "black";
  textElement.style.backgroundClip = "initial";
  textElement.style.webkitBackgroundClip = "initial";
  
  if (record.textAnimation) {
    record.textAnimation.cancel();
    record.textAnimation = undefined;
  }
};

/**
 * Update text for local playback
 * @param {Object} record - Record object
 */
uiHelper.updateTextForLocalPlayback = function(record) {
  const textElement = document.getElementById("text");
  const contents = textElement.innerHTML;
  record.originalTitle = contents;
  const contentsWithPlayButtons = "&#x25b6; " + contents + " &#x25b6;";
  textElement.innerHTML = contentsWithPlayButtons;
  textElement.style.cursor = "pointer";
};

/**
 * Reset text after local playback
 * @param {Object} record - Record object
 */
uiHelper.resetTextForLocalPlayback = function(record) {
  const textElement = document.getElementById("text");
  textElement.innerHTML = record.originalTitle;
  record.originalTitle = undefined;
  textElement.style.cursor = "default";
};

/**
 * Update text with track information
 * @param {Object} record - Record object
 */
uiHelper.updateTextWithTrack = function(record) {
  const t = document.getElementById('track-text');
  const track = record.tracks[record.nextTrackToShow];
  const trackString = `${track.position} - ${track.title}`;
  t.textContent = trackString;
  record.nextTrackToShow = (record.nextTrackToShow + 1) % record.tracks.length;
};

/**
 * Clear track text
 */
uiHelper.clearTrack = function() {
  const t = document.getElementById('track-text');
  t.textContent = "-";
};

/**
 * Run background gradient effect
 * @param {Object} record - Record object with color information
 */
uiHelper.runBackgroundGradient = function(record) {
  const bodyElement = document.body;
  const index = record.id % 4;
  const angles = [0, 90, 180, 270];
  const starts = ["0% 0%", "0% 0%", "0% 100%", "100% 0%"];
  const ends = ["0% 100%", "100% 0%", "0% 0%", "0% 0%"];
  
  // This depends on the body having size 600%, 600%!
  const gradientString = `linear-gradient(${angles[index]}deg, #FFF, #FFF, ${record.currentVariant.colors[0]}, ${record.currentVariant.colors[1]}, #FFF, #FFF)`;
  bodyElement.style.backgroundImage = gradientString;
  
  const keyFrames = [
    { backgroundPosition: starts[index] },
    { backgroundPosition: ends[index] }
  ];
  
  bodyElement.animate(keyFrames, {
    duration: 4000,
    iterations: 1,
  });
};

// Animation wrappers
/**
 * Bounce a record with large movement
 * @param {Object} record - Record object
 */
uiHelper.bounceRecord = function(record) {
  if (!record.isAnimating) {
    animationHelper.makeBounce(record);
  }
};

/**
 * Bounce a record with small movement
 * @param {Object} record - Record object
 */
uiHelper.bounceRecordSmall = function(record) {
  if (!record.isAnimating) {
    animationHelper.makeSmallBounce(record);
  }
};

/**
 * Fade out a record
 * @param {Object} record - Record object
 */
uiHelper.fadeOutRecord = function(record) {
  animationHelper.makeFadeOut(record);
};

/**
 * Fade in a record
 * @param {Object} record - Record object
 */
uiHelper.fadeInRecord = function(record) {
  animationHelper.makeFadeIn(record);
};

/**
 * Move a record to a new position
 * @param {Object} record - Record object
 * @param {number} newX - New X position
 * @param {number} newY - New Y position
 */
uiHelper.moveRecordTo = function(record, newX, newY) {
  animationHelper.makeMove(record, newX, newY);
};

/**
 * Apply a random ambient animation to a record
 * @param {Object} record - Record object
 */
uiHelper.ambientAnimate = function(record) {
  // Temporarily disabled ambient animations
  return;
};

// Available ambient animations
uiHelper._ambientAnimations = [
  uiHelper.bounceRecord,
  uiHelper.bounceRecord,
  uiHelper.bounceRecordSmall,
  uiHelper.bounceRecordSmall,
  function(record) {
    if (!record.isAnimating) {
      animationHelper.makeWalkabout(record);
    }
  }
];

/**
 * Make the big image bounce
 */
uiHelper.bounceBigImage = function() {
  if (uiState.bigImage.isShowing && !uiState.bigImage.isAnimating) {
    animationHelper.bounceBigImage();
  }
};

// Image handling functions
/**
 * Hide all image items
 * @param {Array} data - Array of record objects
 */
uiHelper.hideExistingImages = function(data) {
  for (let i = 0; i < data.length; i++) {
    const element = animationHelper.getRecordElement(data[i]);
    if (element) {
      element.style.visibility = 'hidden';
    }
  }
};

/**
 * Show all image items
 * @param {Array} data - Array of record objects
 */
uiHelper.showExistingImages = function(data) {
  for (let i = 0; i < data.length; i++) {
    const element = animationHelper.getRecordElement(data[i]);
    if (element) {
      element.style.visibility = 'visible';
    }
  }
};

/**
 * Show the big image
 * @param {Object} record - Record to display
 * @param {Array} data - All records data
 * @returns {Promise} - Promise that resolves when image is displayed
 */
uiHelper.displayBigImage = function(record) {
  return imageHelper.displayBigImage(record)
    .then(imgElement => {
      // Set up event handlers for the big image
      const bigImageContainer = document.getElementById('big-image-container');
      
      // Add close handler
      bigImageContainer.onclick = function(e) {
        if (e.target === bigImageContainer) {
          record.onBigImageClose();
        }
      };
      
      // Add hover handler for track info
      bigImageContainer.onmouseover = function() {
        uiHelper.updateTextWithTrack(record);
        uiHelper.bounceBigImage();
      };
      
      return imgElement;
    });
};

/**
 * Remove the big image display
 */
uiHelper.removeBigImage = function() {
  imageHelper.removeBigImage();
  
  // Remove event handlers
  const bigImageContainer = document.getElementById('big-image-container');
  bigImageContainer.onclick = null;
  bigImageContainer.onmouseover = null;
};

/**
 * Draw preload hexagons before images load
 * @param {Object} tess - Tessellation configuration
 */
uiHelper.drawPreloadHexagons = function(tess) {
  const gridContainer = document.getElementById('image-grid');
  
  // Clear existing content
  gridContainer.innerHTML = '';
  
  // Update CSS variables for grid layout
  const gridSize = tess.size;
  const gridColumns = Math.sqrt(tess.defaultItems);
  const gridRows = Math.sqrt(tess.defaultItems);
  
  document.documentElement.style.setProperty('--grid-size', `${gridSize}px`);
  document.documentElement.style.setProperty('--grid-columns', gridColumns);
  document.documentElement.style.setProperty('--grid-rows', gridRows);
  
  // Create placeholder items
  for (let i = 0; i < tess.defaultItems; i++) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-item';
    
    const hexLoader = document.createElement('div');
    hexLoader.className = 'hex-loader';
    
    // Randomize the hex loader appearance
    const timeout = Math.floor(Math.random() * 3000) + 250;
    
    placeholder.appendChild(hexLoader);
    gridContainer.appendChild(placeholder);
    
    // Add animation after random timeout
    setTimeout(() => {
      placeholder.classList.add('small-bounce');
    }, timeout);
  }
};

/**
 * Set up mouse event listeners for a record
 * @param {Object} record - Record object
 * @param {Array} data - Array of all records
 */
uiHelper.setupEventListeners = function(record, data) {
  const element = animationHelper.getRecordElement(record);
  if (!element) return;
  
  element.onmouseover = function() {
    uiHelper.updateTextWithTitle(record);
    uiHelper.bounceRecord(record)
  };
  
  element.onclick = function() {
    record.onMouseDown();
  };
};

/**
 * Replace close-up images
 * @param {Object} record - Selected record
 * @param {Array} data - All records data
 * @param {number} maxTimeMs - Maximum animation time
 * @returns {Promise} - Promise that resolves when all replacements are done
 */
uiHelper.replaceCloseUpImage = function(record, data, maxTimeMs) {
  // This functionality is now handled with CSS transitions
  // instead of generating individual image replacements
  return Promise.resolve();
};

/**
 * Remove close-up images
 * @param {Object} record - Record object
 * @param {Array} data - All records data
 * @param {number} maxTimeMs - Maximum animation time
 * @returns {Promise} - Promise that resolves when all images are removed
 */
uiHelper.removeCloseUpImages = function(record, data, maxTimeMs) {
  // This functionality is now handled with CSS transitions
  return Promise.resolve();
};

/**
 * Handle replacing other records during big image view
 * @param {Object} record - Selected record
 * @param {Array} data - All records data
 * @param {number} maxTimeMs - Maximum animation time
 * @returns {Promise} - Promise that resolves when replacement is complete
 */
uiHelper.replaceOtherRecords = function(record, data, maxTimeMs) {
  // With CSS-based solution, we simply hide other images
  uiHelper.hideExistingImages(data);
  return Promise.resolve();
};

/**
 * Restore other records after closing big image
 * @param {Object} record - Selected record
 * @param {Array} data - All records data
 * @param {number} maxTimeMs - Maximum animation time
 * @returns {Promise} - Promise that resolves when restoration is complete
 */
uiHelper.restoreOtherRecords = function(record, data, maxTimeMs) {
  // With CSS-based solution, we simply show the hidden images
  uiHelper.showExistingImages(data);
  return Promise.resolve();
};
