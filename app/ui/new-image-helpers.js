/**
 * New image helpers to replace fabric.js image functionality with standard HTML/CSS
 */
let imageHelper = {};

/**
 * Load images for all records in the data array
 * @param {Array} data - Array of record objects
 * @returns {Promise} - Promise that resolves when all images are loaded
 */
imageHelper.loadImages = function(data) {
  let promises = [];
  for (let record of data) {
    let promise = imageHelper.loadImage(record.smallImagePath)
      .then(img => {
        record.imageElement = img;
      });
    promises.push(promise);
  }
  return Promise.all(promises);
};

/**
 * Load a single image
 * @param {string} imagePath - Path to the image
 * @returns {Promise} - Promise that resolves with the image element
 */
imageHelper.loadImage = function(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject(new Error(`Failed to load image: ${imagePath}`));
    };
    img.src = imagePath;
  });
};

/**
 * Create an image item DOM element for a record
 * @param {Object} record - Record object containing image data
 * @param {string} shapeClass - CSS class for the shape (square, circle, triangle, rhombus)
 * @returns {HTMLElement} - The created image item element
 */
imageHelper.createImageItem = function(record, shapeClass) {
  // Create container div
  const imageItem = document.createElement('div');
  imageItem.className = `image-item ${shapeClass}`;
  imageItem.id = `image-item-${record.id}`;
  imageItem.dataset.recordId = record.id;
  
  // Create placeholder while image loads
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder';
  
  // Create hex loader with gradient based on record colors
  const hexLoader = document.createElement('div');
  hexLoader.className = 'hex-loader';
  
  // Apply record colors if available
  if (record.currentVariant && record.currentVariant.colors) {
    hexLoader.style.setProperty('--color1', record.currentVariant.colors[0]);
    hexLoader.style.setProperty('--color2', record.currentVariant.colors[1]);
  }
  
  placeholder.appendChild(hexLoader);
  imageItem.appendChild(placeholder);
  
  // If image is already loaded, add it to the container
  if (record.imageElement) {
    const imgClone = record.imageElement.cloneNode(true);
    imageItem.replaceChild(imgClone, placeholder);
  } 
  // Otherwise, load the image and replace the placeholder
  else {
    imageHelper.loadImage(record.smallImagePath)
      .then(img => {
        record.imageElement = img;
        imageItem.replaceChild(img, placeholder);
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  return imageItem;
};

/**
 * Render a grid of images
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 * @param {string} gridContainerId - ID of the grid container element
 */
imageHelper.renderImageGrid = function(data, tessellation, gridContainerId = 'image-grid') {
  const gridContainer = document.getElementById(gridContainerId);
  
  // Clear existing content
  gridContainer.innerHTML = '';
  
  // Update CSS variables for grid layout
  const gridSize = tessellation.size;
  const gridColumns = Math.sqrt(tessellation.defaultItems);
  const gridRows = Math.sqrt(tessellation.defaultItems);
  
  document.documentElement.style.setProperty('--grid-size', `${gridSize}px`);
  document.documentElement.style.setProperty('--grid-columns', gridColumns);
  document.documentElement.style.setProperty('--grid-rows', gridRows);
  
  // Determine shape class based on tessellation type
  let shapeClass = 'shape-square'; // default
  if (tessellation.type === 'circle') {
    shapeClass = 'shape-circle';
  } else if (tessellation.type === 'triangle') {
    shapeClass = 'shape-triangle';
  } else if (tessellation.type === 'rhombus') {
    shapeClass = 'shape-rhombus';
  }
  
  // Create and append image items
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const imageItem = imageHelper.createImageItem(record, shapeClass);
    gridContainer.appendChild(imageItem);
    
    // Add fade-in animation with delay based on record timeout
    setTimeout(() => {
      // Apply fade-in animation
      imageItem.classList.add('fade-in');
      
      // Make sure the image stays permanently visible after the animation completes
      setTimeout(() => {
        // Remove the fade-in class to avoid conflicts with hover
        imageItem.classList.remove('fade-in');
      }, 1000);
    }, record.timeout || 0);
  }
};

/**
 * Display a large image in the big image container
 * @param {Object} record - Record object containing image data
 * @returns {Promise} - Promise that resolves when the image is displayed
 */
imageHelper.displayBigImage = function(record) {
  return new Promise((resolve, reject) => {
    const bigImageContainer = document.getElementById('big-image-container');
    const bigImageWrapper = document.getElementById('big-image-wrapper');
    
    // Clear existing content
    bigImageWrapper.innerHTML = '';
    
    // Create new image element
    imageHelper.loadImage(record.imagePath)
      .then(img => {
        // Store reference to big image
        record.bigImageElement = img;
        
        // Apply shape class if needed
        if (record.bigClipPathClass) {
          bigImageWrapper.className = `big-image-wrapper ${record.bigClipPathClass}`;
        }
        
        // Add image to container
        bigImageWrapper.appendChild(img);
        
        // Show container
        bigImageContainer.classList.add('active');
        
        resolve(img);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Remove the big image display
 */
imageHelper.removeBigImage = function() {
  const bigImageContainer = document.getElementById('big-image-container');
  bigImageContainer.classList.remove('active');
};

/**
 * Preload an image
 * @param {string} imagePath - Path to the image
 * @returns {Promise} - Promise that resolves when the image is loaded
 */
imageHelper.preloadImage = function(imagePath) {
  return imageHelper.loadImage(imagePath);
};
