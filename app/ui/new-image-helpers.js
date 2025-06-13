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
 * Create the preliminary image item DOM element for a record
 * @param {Object} record - Record object containing image data
 * @returns {HTMLElement} - The created image item element
 */
imageHelper.createDivAndPlaceholder = function(record) {
  // Create container div
  const imageItem = document.createElement('div');
  // imageItem.className = `image-item ${shapeClass}`;
  imageItem.id = `image-item-${record.id}`;
  imageItem.dataset.recordId = record.id;
  
  // Add gradient based on record colors
  const hexLoader = document.createElement('div');
  hexLoader.className = 'hex-loader';
  hexLoader.style.setProperty('--color1', record.currentVariant.colors[0]);
  hexLoader.style.setProperty('--color2', record.currentVariant.colors[1]);
  
  imageItem.appendChild(hexLoader);
  
  return imageItem;
};

/**
 * Create an image item DOM element for a record
 * @param {Object} record - Record object containing image data
 * @param {string} shapeClass - CSS class for the shape (square, circle, triangle, rhombus)
 * @returns {HTMLElement} - The created image item element
 */
imageHelper.loadImageItem = function(record, shapeClass) {
  const imageItem = record.imageItem;
  const imgClone = record.imageElement.cloneNode(true);
  const hexLoader = imageItem.children[0];
  imageItem.replaceChild(imgClone, hexLoader);
  imageItem.className = `image-item ${shapeClass}`;
  
  return imageItem;
};

/**
 * Render a grid of images
 * @param {Array} data - Array of record objects
 * @param {Object} tessellation - Tessellation configuration
 * @param {string} gridContainerId - ID of the grid container element
 */
imageHelper.renderImageGridAndPreview = function(data, tessellation, gridContainerId = 'image-grid') {
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

  const timeoutFunction = renderHelper._pickTimeout(tessellation);
  const promises = []
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    timeout = timeoutFunction(i, data.length, tessellation.timeouts["slow"])
    const p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        const imageItem = imageHelper.createDivAndPlaceholder(record)
        record.imageItem = imageItem;
        gridContainer.appendChild(imageItem);
        resolve();
      }, timeout);
    });
    promises.push(p);
  }

  return Promise.all(promises);
}

imageHelper.addImages = function(data, tessellation, gridContainerId = 'image-grid') {
  const shapeClass = `shape-{tessellation.type}`
  const timeoutFunction = renderHelper._pickTimeout(tessellation);
  const promises = [];
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    timeout = timeoutFunction(i, data.length, tessellation.timeouts["slow"])
    const p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        const imageItem = imageHelper.loadImageItem(record, shapeClass);
        resolve();
      }, timeout);
    });
    promises.push(p);
  }
  return Promise.all(promises);
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
