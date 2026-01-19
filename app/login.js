/**
 * Login page functionality
 */

/**
 * Generate a random hex color
 * @returns {string} - Random hex color
 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Draw decorative hexagons on the login page
 */
function drawLoginHexagons() {
  const container = document.getElementById('hexagons-container');

  for (let i = 0; i < 6; i++) {
    const hexWrapper = document.createElement('div');
    hexWrapper.className = 'login-hex-wrapper';

    const hex = document.createElement('div');
    hex.className = 'hex-loader';

    // Generate random colors for this hexagon
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    hex.style.setProperty('--color1', color1);
    hex.style.setProperty('--color2', color2);

    hexWrapper.appendChild(hex);
    container.appendChild(hexWrapper);
  }
}

/**
 * Animate hexagons bouncing in different directions
 */
function bounceHexagons() {
  const hexWrappers = document.querySelectorAll('.login-hex-wrapper');
  const bounceDirections = ['bounce-up', 'bounce-down', 'bounce-left', 'bounce-right'];

  hexWrappers.forEach((hexWrapper, i) => {
    const timeout = Math.floor(Math.random() * 500) + 100;
    const direction = bounceDirections[i % bounceDirections.length];
    setTimeout(() => {
      hexWrapper.classList.add(direction);
    }, timeout);
  });
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

    bounceHexagons();

    try {
      const url= `${apiState.protocol}://${apiState.host}/login`;
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
      // Set our own baby cookie for UI stuff
      document.cookie = `loggedInUser=${username}; expires=${expires_at.toUTCString()}; path=/`;
      displayLoggedIn();
      fetchAndDisplayCollections();
    } catch (error) {
      alert('Login error: ' + error);
    }
  });
}

/**
 * Add create user interaction
 * @param {string} elementId - Element ID for the button or input
 * @param {string} eventType - Event type (click or keypress)
 */
function addCreateUserInteraction(elementId, eventType) {
  document.getElementById(elementId).addEventListener(eventType, async (e) => {
    if (eventType === "keypress" && e.key !== "Enter") {
      return;
    }
    const username = document.getElementById('create-username').value;
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;
    const password_confirmation = document.getElementById('create-password-confirm').value;

    if (!username || !email || !password || !password_confirmation) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== password_confirmation) {
      alert('Passwords do not match');
      return;
    }

    bounceHexagons();

    try {
      const url = `${apiState.protocol}://${apiState.host}/users`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password_confirmation }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors ? data.errors.join(', ') : 'User creation failed');
      }

      alert('Account created! You can now log in.');
      document.getElementById('create-username').value = '';
      document.getElementById('create-email').value = '';
      document.getElementById('create-password').value = '';
      document.getElementById('create-password-confirm').value = '';
      document.getElementById('login-input').value = email;
    } catch (error) {
      alert('Error creating account: ' + error.message);
    }
  });
}

/**
 * Add logout interaction
 * @param {string} elementId - Element ID for the logout button
 * @param {string} eventType - Event type (click or keypress)
 */
function addLogoutInteraction(elementId, eventType) {
  document.getElementById(elementId).addEventListener(eventType, async (e) => {
    if (eventType === "keypress" && e.key !== "Enter") {
      return;
    }

    try {
      const url= `${apiState.protocol}://${apiState.host}/logout`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // need this for cookies
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      alert('Logout error: ' + error);
    }
    console.log("logged out");

    document.cookie = "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    displayLoggedOut();
  });
}

/**
 * Reset UI when logged out
 */
function displayLoggedOut() {
  if (!checkCookieExistence('loggedInUser')) {
    document.getElementById('login-header').textContent = 'login:';
    document.getElementById('login-input').disabled = false;
    document.getElementById('login-input').value = "";
    document.getElementById('password-input').disabled = false;
    document.getElementById('password-input').value = "";
    document.getElementById('login-submit').disabled = false;
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-submit').style.display = '';
    document.getElementById('collections-container').style.display = 'none';
    document.getElementById('collections-list').innerHTML = '';
    document.getElementById('create-user-container').style.display = '';
  }
}

/**
 * Display login-related UI elements if logged in
 */
function displayLoggedIn() {
  if (checkCookieExistence('loggedInUser')) {
    document.getElementById('login-header').textContent = 'logout:';
    document.getElementById('login-input').disabled = true;
    document.getElementById('password-input').disabled = true;
    document.getElementById('login-submit').disabled = true;
    document.getElementById('login-submit').style.display = 'none';
    document.getElementById('logout-button').style.display = '';
    document.getElementById('create-user-container').style.display = 'none';
    fetchAndDisplayCollections();
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

/**
 * Display collections in a list
 * @param {Array} collections - Array of collection objects
 */
function displayCollections(collections) {
  const collectionsList = document.getElementById('collections-list');
  const collectionsContainer = document.getElementById('collections-container');

  collectionsList.innerHTML = '';

  if (collections && collections.length > 0) {
    collections.forEach(collection => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = collection.name.toLowerCase();
      link.textContent = collection.name;
      li.appendChild(link);
      li.appendChild(document.createTextNode(`: ${collection.level}`));
      collectionsList.appendChild(li);
    });
    collectionsContainer.style.display = '';
  } else {
    collectionsContainer.style.display = 'none';
  }
}

/**
 * Fetch and display user's collections
 */
function fetchAndDisplayCollections() {
  const url = `${apiState.protocol}://${apiState.host}/collections`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Failed to fetch collections:', response.status);
        return [];
      }
    })
    .then(collections => {
      displayCollections(collections);
    })
    .catch(error => {
      console.error('Error fetching collections:', error);
    });
}

// Entrypoint
window.addEventListener("load", (event) => {
  drawLoginHexagons();
  addLoginInteraction("password-input", "keypress");
  addLoginInteraction("login-submit", "keypress");
  addLoginInteraction("login-submit", "click");
  addLogoutInteraction("logout-button", "click");
  addCreateUserInteraction("create-password-confirm", "keypress");
  addCreateUserInteraction("create-user-submit", "click");
  displayLoggedIn();
});
