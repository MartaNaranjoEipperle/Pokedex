/**
 * Displays the login modal, updates favorite status and cards, and adds a resize listener.
 */
function LogInUser() {
    checkLogHeight();
    document.getElementById('loginModal').style.display = 'block';
    updateFavoriteStatus();
    updateFavoriteCards();
    addCheckResizeListener(checkLogHeight);
}

/**
 * Handles user logout: displays a goodbye message, hides favorite and login forms, and resets user data.
 */
function logout() {
    if (loggedInUser) {
        loginOn = false;
        let userData = loggedInUser; 
        document.getElementById('bye').innerHTML = `See you soon ${userData.username}!`; 
        document.getElementById('greetings').style.display = 'none';
        document.getElementById('bye').style.display = 'flex';
        setTimeout(function () {
            document.getElementById('favoriteForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'flex';
            document.getElementById('user').style.backgroundImage = `url('./img/pokefav.001.png')`;  
            loggedInUser = null;
        }, 2000);
    }
}

/**
 * Retrieves user data based on the username.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} - A promise that resolves to the user data.
 */
async function getUser(username) {
    return await getUserData(username);
}

/**
 * Checks if the provided password matches the user's password.
 *
 * @param {Object} userData - The user data object.
 * @param {string} password - The password to check.
 * @returns {boolean} - Returns true if the password is correct, otherwise false.
 */
function isPasswordCorrect(userData, password) {
    return userData && userData.password === password;
}

/**
 * Resets the login form and shows the elements for logged-in users.
 */
function resetFormAndShowElements() {
    document.getElementById('input-name').value = '';
    document.getElementById('input-password').value = '';
    document.getElementById('bye').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('favoriteForm').style.display = 'flex';
    document.getElementById('greetings').style.display = 'flex';
}

/**
 * Updates the user interface with the logged-in user's information.
 *
 * @param {Object} userData - The user data object.
 */
function updateUserInfo(userData) {
    document.getElementById('loggedUserName').innerHTML = `${userData.username}`;
    document.getElementById('user').style.backgroundImage = `url('${userData.profilePicture}')`;
}

/**
 * Updates the greeting message based on the current time.
 */
function updateGreeting() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let greeting;
    
    if (currentHour < 8) {
        greeting = "Good morning";
    } else if (currentHour < 13) {
        greeting = "Good afternoon";
    } else if (currentHour < 18) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }
    
    document.getElementById('time').innerHTML = `${greeting}`;
}

/**
 * Updates the favorite Pokémon cards and status based on user data.
 *
 * @param {Object} userData - The user data object.
 */
function updateFavorites(userData) {
    let favoritePokemons = userData.favorites || [];
    updateFavoriteCards();
    updateFavoriteStatus();
}

/**
 * Updates the user interface for a logged-in user, including user info, greeting, and favorites.
 *
 * @param {Object} userData - The user data object.
 */
function updateUIForLoggedInUser(userData) {
    resetFormAndShowElements();
    updateUserInfo(userData);
    updateGreeting();
    updateFavorites(userData);
}

/**
 * Displays an error message in the message box.
 *
 * @param {string} message - The error message to display.
 */
function showErrorMessage(message) {
    document.getElementById('message-box').innerText = message;
    document.getElementById('message-box').style.display = 'block';
}

/**
 * Handles user login: verifies credentials, updates user status, and user interface.
 */
async function login() {
    let usernameInput = document.getElementById('input-name').value;
    let passwordInput = document.getElementById('input-password').value;
    
    document.getElementById('message-box').style.display = 'none';

    const userData = await getUser(usernameInput);

    if (isPasswordCorrect(userData, passwordInput)) {
        loginOn = true;
        loggedInUser = userData;
        updateUIForLoggedInUser(userData);
    } else {
        showErrorMessage('User data or password is incorrect');
    }
}

/**
 * Fetches all user data from the API.
 *
 * @returns {Promise<Object>} - A promise that resolves to the data of all users.
 * @throws {Error} - Throws an error if there is an issue fetching the data.
 */
async function fetchAllUsersData() {
    let response = await fetch(`${BASE_URL}/users.json`);
    let responseAll = await fetch(BASE_URL + '/.json');
    
    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Benutzerdaten');
    }
    
    return {
        allUsers: await response.json(),
        allUsersJson: await responseAll.json()
    };
}

/**
 * Finds a user by their username in the list of users.
 *
 * @param {Object} allUsersJson - The JSON object containing all users.
 * @param {string} username - The username to search for.
 * @returns {Object|null} - The user object if found, otherwise null.
 */
function findUserByUsername(allUsersJson, username) {
    for (let i = 0; i < allUsersJson.users.length; i++) {
        let user = allUsersJson.users[i];
        if (user.username === username) {
            return user;
        }
    }
    return null;
}

/**
 * Displays a "user not found" message in the message box.
 */
function showUserNotFoundMessage() {
    document.getElementById('message-box').innerText = 'User not found';
    document.getElementById('message-box').style.display = 'block';
}

/**
 * Retrieves user data based on the username and handles errors.
 *
 * @param {string} username - The username to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user data if found.
 * @throws {Error} - Throws an error if the user is not found or there is an issue with the data.
 */
async function getUserData(username) {
    try {
        const { allUsers, allUsersJson } = await fetchAllUsersData();
        
        if (allUsers) {
            let foundUser = findUserByUsername(allUsersJson, username);
            
            if (foundUser) {
                return foundUser;
            } else {
                showUserNotFoundMessage();
                throw new Error('Benutzer nicht gefunden');
            }
        } else {
            throw new Error('Ungültige Datenstruktur in der Firebase');
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Shows the login form and hides the registration form.
 */
function loginAgain() {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('message-box').style.display = 'none';
}

/**
 * Checks the height of the window and adjusts the display of elements accordingly.
 */
function checkLogHeight() {
    if (window.matchMedia("(max-height: 540px)").matches) {
        displayAlert();
        document.getElementById('loginModal').classList.add('none');
        document.getElementById('more').classList.add('none');
    } else {
        hideAlert();
        document.getElementById('loginModal').classList.remove('none');
        document.getElementById('more').classList.remove('none');
    }
}

/**
 * Adds or removes a resize event listener based on the provided function.
 *
 * @param {Function} checkMyH - The function to call when resizing.
 */
function addCheckResizeListener(checkMyH) {
    if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
    }
    resizeListener = function() {
        checkMyH();
    };
    window.addEventListener('resize', resizeListener);
}
