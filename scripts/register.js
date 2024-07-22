const pokemonNames = ['pikachu', 'charmander', 'jigglypuff', 'psyduck', 'bulbasaur', 'caterpie', 'squirtle'];
let loginOn = false;
let favoriteStatus = {};
let loggedInUser = null;

/**
 * Fetches details of a Pokémon from the PokeAPI.
 *
 * @param {string} pokemonName - The name of the Pokémon to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the Pokémon details.
 */
async function fetchPokemonDetails(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    return await response.json();
}

/**
 * Displays Pokémon images in the Pokémon selection area.
 *
 * @param {Object[]} pokemonDetails - An array of Pokémon details.
 */
function displayPokemon(pokemonDetails) {
    let pokemonSelection = document.getElementById('pokemonSelection');
    pokemonSelection.innerHTML = ''; // Clear existing content
    pokemonDetails.forEach(pokemon => {
        let pokemonImg = document.createElement('img');
        pokemonImg.src = pokemon.sprites.other.home.front_default;
        pokemonImg.alt = pokemon.name;
        pokemonImg.onclick = () => selectPokemon(pokemonImg.src);
        pokemonSelection.appendChild(pokemonImg);
    });
}

/**
 * Closes the login modal and removes the resize event listener if applicable.
 */
function closeModal() {
    if (resizeListener && !window.matchMedia("(max-height: 540px)").matches) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null;
    }
    document.getElementById('loginModal').style.display = 'none';
}

/**
 * Shows the registration form and hides the login form.
 */
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

/**
 * Selects a Pokémon by URL, highlights the selected Pokémon, and updates the user background image.
 *
 * @param {string} url - The URL of the Pokémon image.
 */
function selectPokemon(url) {
    let imgs = document.querySelectorAll('#pokemonSelection img');
    imgs.forEach(img => {
        img.classList.remove('selected');
    });
    let selectedImg = document.querySelector(`#pokemonSelection img[src="${url}"]`);
    selectedImg.classList.add('selected');
    document.getElementById('user').style.backgroundImage = `url('${url}')`;
}

/**
 * Fetches user data from the Firebase database.
 *
 * @returns {Promise<Object>} - A promise that resolves to the user data.
 * @throws {Error} - Throws an error if there is an issue fetching the data.
 */
async function fetchUsersData() {
    const response = await fetch('https://pokedex-31d32-default-rtdb.europe-west1.firebasedatabase.app/users.json');
    if (!response.ok) {
        throw new Error('Error fetching user data');
    }
    return await response.json();
}

/**
 * Checks if a user with the given username or email already exists.
 *
 * @param {Object} users - The users object.
 * @param {string} username - The username to check.
 * @param {string} email - The email to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
function checkIfUserExists(users, username, email) {
    for (const key in users) {
        if (users[key].username === username || users[key].email === email) {
            return true;
        }
    }
    return false;
}

/**
 * Saves user data to the Firebase database.
 *
 * @param {Object} userData - The user data to save.
 * @throws {Error} - Throws an error if there is an issue saving the data.
 */
async function saveUserData(userData) {
    const response = await fetch('https://pokedex-31d32-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Error saving user data');
    }
}

/**
 * Resets the registration form fields.
 */
function resetFormFields() {
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('email').value = '';
}

/**
 * Shows a message indicating that the username or email already exists.
 */
function showUserExistsMessage() {
    let userExistDiv = document.getElementById('userExist');
    userExistDiv.innerText = 'Username or email already exists.';
}

/**
 * Handles user registration by validating input, saving user data, and updating the UI.
 */
async function register() {
    try {
        let username = document.getElementById('newUsername').value;
        let password = document.getElementById('newPassword').value;
        let email = document.getElementById('email').value;
        let profilePicture = document.querySelector('#pokemonSelection img.selected').src;
        let favorites = '';
        let id = '';
        
        let userData = {
            id,
            username,
            password,
            email,
            profilePicture,
            favorites,
        };
        let users = await fetchUsersData();
        if (checkIfUserExists(users, username, email)) {
            showUserExistsMessage();
            return;
        }
        await saveUserData(userData); 
        resetFormFields();
        loginAgain(); 

    } catch (error) {
        console.error('Error during registration:', error);
    }
}

/**
 * Fetches all users data from the Firebase database.
 *
 * @returns {Promise<Object>} - A promise that resolves to the users data.
 */
async function getUsers() {
    let response = await fetch(BASE_URL + "/users.json");
    let data = await response.json();
    return data ? data : {};
}

/**
 * Updates data at a specific path in the Firebase database.
 *
 * @param {string} path - The path in the database where data should be updated.
 * @param {Object} data - The data to save.
 * @returns {Promise<Object>} - A promise that resolves to the response from Firebase.
 */
async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '/.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/**
 * Saves user data to the Firebase database with a new ID.
 *
 * @param {Object} userData - The user data to save.
 * @throws {Error} - Throws an error if there is an issue saving the data.
 */
async function saveUserData(userData) {
    try {
        let users = await getUsers();
        let userIds = Object.keys(users).map(id => parseInt(id)).sort((a, b) => a - b);
        let newUserId = userIds.length > 0 ? Math.max(...userIds) + 1 : 0;
        let response = await putData("/users/" + newUserId, userData);
        console.log("User data successfully saved to Firebase:", response);
        userData.id = newUserId; 
        users[newUserId] = userData; 
        await putData("/users", users);
    } catch (error) {
        throw error;
    }
}

/**
 * Displays an error message based on the provided type.
 *
 * @param {string} type - The type of error message to display.
 */
function errorMessage(type) {
    let output = document.getElementById('message-box');
    output.classList.remove('dis-none');

    switch (type) {
        case 'emailExists':
            output.innerHTML = '<p>The email address is already registered. Please choose a different email address.</p>';
            break;
        case 'usernameExists':
            output.innerHTML = '<p>The username is already taken. Please choose a different username.</p>';
            break;
        default:
            output.innerHTML = '<p>An error occurred. Please try again.</p>';
            break;
    }
}
