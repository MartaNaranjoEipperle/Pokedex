const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=250';
const speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/?limit=250';
const BASE_URL = 'https://pokedex-31d32-default-rtdb.europe-west1.firebasedatabase.app';
let pokemonList = [];
let speciesList = [];
let favoritePokemons = [];
let combinedData = {};
let isBigCardOpen = false;
let outsideClickCounter = 0;
let isFunctionEnabled = true;
let resizeListener;



/**
  * Initializes the application by loading data and showing a loading animation.
 *
 * - `loadFireData`: Loads fire data synchronously.
 * - `showLoadingSpinner`: Displays a loading spinner.
 * - `getCards`: Asynchronously fetches card data.
 * - `disableLoadingSpinner`: Hides the loading spinner.
 * - Includes error handling in case fetching card data fails.
 *
 * @async
 * @returns {Promise<void>} Returns a promise that resolves when initialization is complete.
 */
async function init(){
    loadFireData();
    showLoadingSpinner();
    await getCards();
    disableLoadingSpinner();
}

/**
 * Fetches fire data from the server.
 *
 * - Fetches data from the base URL with the '.json' endpoint.
 * - Logs the JSON response to the console.
 * 
 * @async
 * @returns {Promise<void>} Returns a promise that resolves when fire data is loaded.
 */
async function loadFireData(){
    let response = await fetch(BASE_URL + '/.json');
    let responseToJson = await response.json()
    console.log(responseToJson);
}

/**
 * Creates and displays card HTML elements and loads Pokémon data.
 *
 * - Creates 250 card HTML elements.
 * - Loads Pokémon and species data asynchronously.
 * - Initializes the application with the loaded data.
 *
 * @async
 * @returns {Promise<void>} Returns a promise that resolves when all cards are fetched and displayed.
 */
async function getCards() {
    for (let i = 0; i < 250; i++) {
        document.getElementById('cards').innerHTML += createCardHTML(i + 1);
    }
    await Promise.all([loadPoke(apiUrl), loadData(speciesUrl)]);
    getStart();
}

/**
 * Fetches and processes Pokémon list data from the given API URL.
 *
 * - Fetches Pokémon list data from the provided API URL.
 * - Processes each Pokémon in the list by loading its data.
 * - Handles errors that may occur during the fetch operation.
 *
 * @async
 * @param {string} apiUrl - The API URL to fetch Pokémon data from.
 * @returns {Promise<void>} Returns a promise that resolves when Pokémon data is loaded.
 */
async function loadPoke(apiUrl) {
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        pokemonList = data.results;
        await Promise.all(pokemonList.map(loadPokemonData));
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
}

/**
 * Fetches details for a specific Pokémon by name.
 *
 * - Fetches Pokémon details from the PokéAPI.
 * - Returns the Pokémon details as a JSON object.
 * - Handles errors that may occur during the fetch operation.
 *
 * @async
 * @param {string} pokemonName - The name of the Pokémon to fetch details for.
 * @returns {Promise<Object|null>} Returns a promise that resolves to the Pokémon details or null if an error occurs.                              
 */
async function fetchPokemonDetails(pokemonName) {
    try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        let response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon details');
        }
        let pokemonDetails = await response.json();
        return pokemonDetails;
    } catch (error) {
        return null; 
    }
}

/**
 * Fetches and processes data for a specific Pokémon.
 *
 * - Fetches data for a Pokémon from its URL.
 * - Processes the fetched data.
 * - Sets up click handlers for the Pokémon card.
 * - Handles errors that may occur during the fetch operation.
 *
 * @async
 * @param {Object} pokemon - The Pokémon to load data for.
 * @returns {Promise<void>} Returns a promise that resolves when Pokémon data is processed.             
 */
async function loadPokemonData(pokemon) {
    try {
        let response = await fetch(pokemon.url);
        let pokemonData = await response.json();
        await processPokemonData(pokemonData);
        await setupCardClickHandlerData(pokemonData);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

/**
 * Processes the data for a Pokémon and updates the DOM.
 * 
 * - Processes the Pokémon data and updates the UI elements.
 *
 * @async
 * @param {Object} pokemonData - The data of the Pokémon to process.
 * @returns {Promise<void>} Returns a promise that resolves when Pokémon data is processed and displayed.
 */
async function processPokemonData(pokemonData) {
    combinedData[pokemonData.id] = combinedData[pokemonData.id] || {};
    combinedData[pokemonData.id].pokemonData = pokemonData;
    let types = pokemonData.types.map(type =>
        `<p class="${type.type.name} type"> ${type.type.name} </p>`).join('');
    let number = pokemonData.id;
    let pokemonPicture = document.getElementById(`picture${number}`);
    let pokemonName = document.getElementById(`pokemon${pokemonData.id}`);
    let pokemonType = document.getElementById(`type${pokemonData.id}`);
    let pic = pokemonData.sprites.other.home.front_default;
    pokemonPicture.innerHTML = `<img src= "${pic}" id="img${number}">`;
    pokemonType.innerHTML = `<div class="column">${types}</div>`;
    pokemonName.innerHTML = `<h2 class="center">${pokemonData.name} </h2>`;
}

/**
 * Sets up the click handler for a Pokémon card. 
 *
 * - Sets up the click event handler for the Pokémon card.
 *
 * @async
 * @param {Object} pokemonData - The data of the Pokémon to set up the click handler for.
 * @returns {Promise<void>} Returns a promise that resolves when the click handler is set up.
 */
async function setupCardClickHandlerData(pokemonData) {
    let card = document.getElementById(`cardPicture${pokemonData.id}`);
    card.onclick = function () {
        let speciesData = combinedData[pokemonData.id]?.speciesData;
        if (speciesData) {
            bigCard(pokemonData, speciesData);
        } else {
            alert('Species data not loaded yet');
        }
    };
}

/**
 * Fetches and processes species data from the given URL.
 *
 * - Fetches species data from the provided URL.
 * - Processes each species in the list by loading its data.
 * - Displays the Pokémon details with the loaded species data.
 * - Handles errors that may occur during the fetch operation.
 *
 * @async
 * @param {string} speciesUrl - The URL to fetch species data from.
 * @returns {Promise<void>} Returns a promise that resolves when species data is loaded.
 */
async function loadData(speciesUrl) {
    try {
        let response = await fetch(speciesUrl);
        let data = await response.json();
        speciesList = data.results;
        await Promise.all(speciesList.map(loadSpeciesData));
        let filteredSpecies = speciesList.filter(species => pokemonNames.includes(species.name));
        let pokemonDetails = await Promise.all(filteredSpecies.map(species => fetchPokemonDetails(species.name)));
        displayPokemon(pokemonDetails);
    } catch (error) {
        console.error('Error fetching Pokémon species list:', error);
    }
}


/**
 * Fetches and processes data for a specific species.
 *
 * - Fetches data for a species from its URL.
 * - Processes the fetched data.
 * - Sets up click handlers for the species card.
 * - Handles errors that may occur during the fetch operation.
 *
 * @async
 * @param {Object} species - species The species object containing the URL to fetch data from.
 * @returns {Promise<void>} Returns a promise that resolves when the species data is fetched, processed, and click handlers are set up.                     
 */
async function loadSpeciesData(species) {
    try {
        let response = await fetch(species.url);
        let speciesData = await response.json();
        processSpeciesData(speciesData);
        setupCardClickHandler(speciesData);
    } catch (error) {
        console.error('Error fetching species data:', error);
    }
}

/**
 * Processes and displays data for a specific species.
 *
 * - Processes the species data and updates the UI elements.
 *
 * @param {Object} speciesData - The data of the species to process.
 */
function processSpeciesData(speciesData) {
    combinedData[speciesData.id] = combinedData[speciesData.id] || {};
    combinedData[speciesData.id].speciesData = speciesData;

    let cardId = `cardPicture${speciesData.id}`;
    let colorElement = document.getElementById(cardId);
    let colorName = speciesData.color.name;
    colorElement.classList.add(colorName);
}

/**
 * Sets up the click handler for a species card.
 *
 * - Sets up the click event handler for the species card.
 *
 * @param {Object} speciesData - The data of the species to set up the click handler for.
 */
function setupCardClickHandler(speciesData) {
    let cardId = `cardPicture${speciesData.id}`;
    document.getElementById(cardId).onclick = function () {
        let pokemonData = combinedData[speciesData.id]?.pokemonData;
        if (pokemonData) {
            bigCard(pokemonData, speciesData);
        } else {
            alert('Pokémon data not loaded yet');
        }
    };
}

/**
 * Initializes the application by hiding some cards initially.
 *
 * - Hides cards with IDs greater than 20.
 */
function getStart() {
    for (let i = 20; i < 250; i++) {
        document.getElementById(`cardPicture${i + 1}`).classList.add('none');
    }
}

/**
 * Reveals more cards and reloads the card container.
 *
 * - Reveals hidden cards.
 * - Reloads the card container to apply updates.
 */
function getMore() {
    revealMoreCards();
    reloadCards();
}

/**
 * Reveals hidden cards.
 *
 * - Removes the 'none' class from cards with IDs greater than 15.
 * - Hides the "more" button.
 */
function revealMoreCards() {
    for (let i = 15; i < 250; i++) {
        document.getElementById(`cardPicture${i + 1}`).classList.remove('none');
    }
    document.getElementById('more').classList.add('none');
}

/**
 * Reloads the card container to apply updates.
 *
 * - Removes and re-appends the card container to apply updates.
 */
function reloadCards() {
    let cardsContainer = document.getElementById('cards');
    let parent = cardsContainer.parentNode;
    parent.removeChild(cardsContainer);
    parent.appendChild(cardsContainer);
}

/**
 * Disables a certain function.
 *
 * - Sets `isFunctionEnabled` to true.
 */
function disableFunction() {
    isFunctionEnabled = true;
}

/**
 * Handles click events to close the big card when clicking outside.
 *
 * - Listens for click events.
 * - Closes the big card if clicked outside twice.
*/
document.addEventListener('click', function (event) {
    let front = document.getElementById('front');
    let targetElement = event.target;
    if (isBigCardOpen && targetElement !== front && !front.contains(targetElement)) {
        outsideClickCounter++;
        if (outsideClickCounter >= 2) {
            closeBigCard();
            outsideClickCounter = 1;
        }
    } else {
        outsideClickCounter = 1;
    }
});

/**
 * Hides the message box when the function is called.
 *
 * - Adds the class `dis-none` to the element with the ID `message-box`.
 * - This class typically hides the element from view.
 */
function hideOnFocus() {
    let output = document.getElementById('message-box');
    output.classList.add('dis-none');
}