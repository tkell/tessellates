# Tessellates Refactor: fabric.js to HTML/CSS

This document explains the major refactoring done to replace the fabric.js canvas-based implementation with standard HTML and CSS.

## Overview

The original implementation used fabric.js to create, manipulate, and animate images on an HTML canvas. This approach has been replaced with a more modern solution using CSS Grid for layout, standard HTML images, and CSS animations.

## Key Changes

1. **Canvas Replacement**: Replaced the fabric.js canvas with a CSS Grid layout
2. **Image Handling**: Replaced fabric.js image objects with standard HTML img elements
3. **Animation**: Replaced fabric.js animation chains with CSS animations and Web Animations API
4. **Clipping**: Replaced fabric.js clipping paths with CSS clip-path
5. **Event Handling**: Replaced fabric.js event handlers with standard DOM event listeners

## Implementation Details

### Directory Structure

New files have been created with a `new-` prefix to allow for easy comparison and rollback if needed:

- `new-main.css`: CSS styles for the new implementation
- `new-main.js`: Main application logic
- `new-api-helpers.js`: API interaction helpers
- `ui/new-image-helpers.js`: Image loading and rendering helpers
- `ui/new-animation-helpers.js`: Animation helpers using CSS and Web Animations API
- `ui/new-ui-helpers.js`: UI utility functions
- `ui/new-render-helpers.js`: Rendering logic for the image grid
- `tessellations/new-timeout-functions.js`: Timing functions for animations
- `tessellations/new-square.js`: Refactored square tessellation configuration
- `tessellations/new-circle.js`: Refactored circle tessellation configuration
- `tessellations/new-triangle.js`: Refactored triangle tessellation configuration
- `tessellations/new-rhombus.js`: Refactored rhombus tessellation configuration

### Script Loading Order

It's important to load the scripts in the correct order to avoid reference errors:

1. First: Animation and UI helpers
2. Second: Tessellation configurations
3. Last: Main application

### CSS Grid Layout

Instead of a canvas, we now use a CSS Grid to layout images:

```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  grid-template-rows: repeat(var(--grid-rows), 1fr);
  width: 100%;
  height: 100%;
}
```

### CSS Clipping Paths

Instead of fabric.js clipping paths, we use CSS clip-path:

```css
.shape-square {
  clip-path: inset(0);
}

.shape-circle {
  clip-path: circle(50% at center);
}

.shape-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.shape-rhombus {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

### CSS Animations

Instead of fabric.js animation chains, we use CSS animations:

```css
@keyframes bounce {
  0% { transform: translateY(0); }
  25% { transform: translateY(-10px); }
  50% { transform: translateY(5px); }
  75% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}

.bounce {
  animation: bounce var(--animation-duration-slow) ease-in-out;
}
```

### Image Loading

Images are now loaded using standard JavaScript Image objects:

```javascript
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
```

## Benefits of the Refactor

1. **Improved Performance**: Renders faster and uses less memory than canvas
2. **Better Browser Support**: Uses standard web technologies
3. **Easier Maintenance**: Code is more straightforward and uses familiar patterns
4. **Improved Accessibility**: Standard HTML elements are more accessible than canvas
5. **Better SEO**: Images are now part of the DOM and can be indexed

## Using the New Implementation

To use the new implementation, modify the HTML file to reference the new JavaScript and CSS files:

```html
<link rel="stylesheet" href="../new-main.css">
<script src="../params.js"></script>
<script src="../ui/new-image-helpers.js"></script>
...
<script src="../new-main.js"></script>
```

And use the new index.html template that includes the grid container instead of the canvas:

```html
<div class="tessellation-container">
  <div id="image-grid" class="image-grid">
    <!-- Images will be inserted here dynamically -->
  </div>
</div>
```