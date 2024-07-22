
/**
 * Displays a detailed view of the selected Pokémon and hides other UI elements.
 * - Hides the login modal.
 * - Checks the screen height and initializes the big card view if appropriate.
 *
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 * @param {Object} speciesData - Data related to the species of the selected Pokémon.
 */
function bigCard(pokemonData, speciesData) {
    getMore();
    document.getElementById('loginModal').style.display = 'none';
    let i = pokemonData.id;
    if (!isBigCardOpen) {
        checkScreenHeight(i, pokemonData, speciesData);
        addCheckResizeListener(() => checkScreenHeight(i, pokemonData, speciesData));
    } 
    else {checkScreenHeight(i, pokemonData, speciesData);}
}

/**
 * Checks if the screen height is suitable for displaying the big card view.
 *
 * - Closes the big card and displays an alert if the screen height is too small.
 * - Initializes the card view if the screen height is sufficient.
 * 
 * @param {number} i - The ID of the Pokémon.
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 * @param {Object} speciesData - Data related to the species of the selected Pokémon.
 */
function checkScreenHeight(i, pokemonData, speciesData) {
    if (window.matchMedia("(max-height: 540px)").matches) {
        closeBigCard();
        displayAlert();
    } else {
        hideAlert();
        initializeCard(i, pokemonData, speciesData);
    }
}

/**
 * Initializes the big card view with the selected Pokémon data.
 *  
 * - Sets up the background and updates the front card with Pokémon details.
 * - Adds event handlers for the card actions (show, news, stats, evolution).
 * - Updates the heart status if applicable.
 *
 * @param {number} i - The ID of the Pokémon.
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 * @param {Object} speciesData - Data related to the species of the selected Pokémon.
 */
function initializeCard(i, pokemonData, speciesData) {
    if (isFunctionEnabled) {
        background();
        updateFrontCard(i, pokemonData);
        getInfo(pokemonData);
        onclickBigCard(i, speciesData, pokemonData);
        updateHeartStatus(i);
        if (loginOn) { 
            updateFavoriteStatus(); 
        }
    }
}

/**
 * Displays an alert if the screen height is too small to show the big card.
 *
 * - Shows the alert message and hides other UI elements.
 */
function displayAlert() {
    document.getElementById('alert').classList.remove('none');
    document.getElementById('cards').classList.add('none');
    document.getElementById('header').classList.add('none');
}

/**
 * Hides the alert and restores the visibility of other UI elements.
 *
 * - Hides the alert message and shows other UI elements.
 */
function hideAlert() {
    document.getElementById('alert').classList.add('none');
    document.getElementById('cards').classList.remove('none');
    document.getElementById('header').classList.remove('none');  
}

/**
 * Updates the front card with the Pokémon's name, photo, and other details.
 *
 * @param {number} i - The ID of the Pokémon.
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 */
function updateFrontCard(i, pokemonData) {
    let name = document.getElementById(`pokemon${i}`).innerHTML;
    let photo = `<img class="bCardPhoto" src="${pokemonData.sprites.other.home.front_default}">`;
    let frontCard = document.getElementById(`cardPicture${i}`).classList;
    front.innerHTML = bigCardLoad(i, frontCard, name, photo, pokemonData);
    document.getElementById(`frontCard${i}`).classList.remove('card');
}

/**
 * Updates the heart icon based on the Pokémon's favorite status.
 *
 * @param {number} i - The ID of the Pokémon.
 */
function updateHeartStatus(i) {
    let heart = document.getElementById('heart' + i);
    if (favoriteStatus[i]) {
        heart.classList.add('red-heart');
        heart.classList.remove('heart');
    } else {
        heart.classList.remove('red-heart');
        heart.classList.add('heart');
    }
}

/**
 * Updates the favorite status of Pokémon for the logged-in user.
 *
 * - Checks the favorites list of the logged-in user and updates the heart icons accordingly.
 */
function updateFavoriteStatus() {
    if (loggedInUser && loggedInUser.favorites && loggedInUser.favorites.length > 0) {
        let heartElements = loggedInUser.favorites;
        for (let i = 0; i < heartElements.length; i++) {
            let heartId = heartElements[i];
            let heartLike = document.getElementById('heart' + heartId);
            if (heartLike) {
                heartLike.classList.remove('heart');
                heartLike.classList.add('red-heart');
            } 
        }
    } 
}

/**
 * Sets up the background and layout for the big card view.
 *
 * - Scrolls to the top of the page and updates UI elements for the big card view.
 */
function background() {
    window.scrollTo(0, 0);
    smallCard();
    isBigCardOpen = true;
    outsideClickCounter = 0;
    isFunctionEnabled = false;
}

/**
 * Adjusts the UI to show the small card view while the big card is open.
 */
function smallCard() {
    let front = document.getElementById('front');
    let cards = document.getElementById('cards');
    let header = document.getElementById('header');
    cards.classList.add('opacity');
    front.classList.remove('none');
    header.style.zIndex = "0";
    header.style.opacity = "0.5";
}

/**
 * Adds event handlers for actions on the big card.
 *
 * @param {number} i - The ID of the Pokémon.
 * @param {Object} speciesData - Data related to the species of the selected Pokémon.
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 */
function onclickBigCard(i, speciesData, pokemonData) {
    document.getElementById(`news${i}`).onclick = function () {
        news(speciesData);
    }
    document.getElementById(`evolution${i}`).onclick = function () {
        evolution(speciesData);
    }
    document.getElementById(`show${i}`).onclick = function () {
        show(pokemonData);
    }
    document.getElementById(`stats${i}`).onclick = function () {
        stats(pokemonData);
    }
}

/**
 * Moves to the next Pokémon in the list and displays its details.
 *
 * @param {number} currentId - The ID of the current Pokémon.
 */
function right(currentId) {
    getNow();
    let nextId = currentId + 1;
    if (nextId > 250) {
        nextId = 1;
    }
    let pokemonData = combinedData[nextId]?.pokemonData;
    let speciesData = combinedData[nextId]?.speciesData;
    if (pokemonData && speciesData) {
        showBigP(pokemonData, speciesData)
    }
}

/**
 * Moves to the previous Pokémon in the list and displays its details.
 *
 * @param {number} currentId - The ID of the current Pokémon.
 */
function left(currentId) {
    getNow();
    let prevId = currentId - 1;
    if (prevId < 1) {
        prevId = 250;
    }
    let pokemonData = combinedData[prevId]?.pokemonData;
    let speciesData = combinedData[prevId]?.speciesData;
    if (pokemonData && speciesData) {
        showBigP(pokemonData, speciesData)
    }
}

/**
 * Displays the detailed view of the specified Pokémon.
 *
 * @param {Object} pokemonData - Data related to the selected Pokémon.
 * @param {Object} speciesData - Data related to the species of the selected Pokémon.
 */
function showBigP(pokemonData, speciesData) {
    isFunctionEnabled = true;
    bigCard(pokemonData, speciesData);
}

/**
 * Ensures that all Pokémon cards are visible and updates the "more" button.
 */
function getNow() {
    for (let i = 15; i < 250; i++) {
        document.getElementById(`cardPicture${i + 1}`).classList.remove('none');
    }
    document.getElementById('more').classList.add('none');
}

/**
 * Closes the big card view and restores the previous UI state.
 */
function closeBigCard() {
    let front = document.getElementById('front');
    let cards = document.getElementById('cards');
    let header = document.getElementById('header');
    if (resizeListener && !window.matchMedia("(max-height: 540px)").matches) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null; // Setze die Referenz auf null, um Speicherlecks zu vermeiden
    }
    cards.classList.remove('opacity');
    front.classList.add('none');
    header.style.zIndex = "1000";
    header.style.opacity = "1";
    isBigCardOpen = false;
    hideAlert();
    disableFunction();
}



