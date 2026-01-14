/**
 * Login page functionality
 */

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
    document.getElementById('login-input').disabled = false;
    document.getElementById('login-input').value = "";
    document.getElementById('password-input').disabled = false;
    document.getElementById('password-input').value = "";
    document.getElementById('login-submit').disabled = false;
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-submit').style.display = '';
    document.getElementById('collections-container').style.display = 'none';
    document.getElementById('collections-list').innerHTML = '';
  }
}

/**
 * Display login-related UI elements if logged in
 */
function displayLoggedIn() {
  if (checkCookieExistence('loggedInUser')) {
    document.getElementById('login-input').disabled = true;
    document.getElementById('password-input').disabled = true;
    document.getElementById('login-submit').disabled = true;
    document.getElementById('login-submit').style.display = 'none';
    document.getElementById('logout-button').style.display = '';
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
      li.textContent = `${collection.name}: ${collection.level}`;
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
  addLoginInteraction("password-input", "keypress");
  addLoginInteraction("login-submit", "keypress");
  addLoginInteraction("login-submit", "click");
  addLogoutInteraction("logout-button", "click");
  displayLoggedIn();
});
