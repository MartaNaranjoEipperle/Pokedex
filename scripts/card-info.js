/**
 * Updates the Pokémon information section with details about a specific Pokémon.
 *
 * - Formats the Pokémon number.
 * - Retrieves the abilities and types of the Pokémon.
 * - Updates the HTML content of the information section.
 +
 * @param {Object} pokemonData The data of the Pokémon to display.
 */
function getInfo(pokemonData) {
    let number = formatNumber(pokemonData.id.toString());
    let abilities = pokemonData.abilities.map(ability =>
        `<p class="about"> ${ability.ability.name} </p>`).join('');
    let type = pokemonData.types.map(type =>
        `<p class="about"> ${type.type.name} </p>`).join('');
    let info = document.getElementById(`info${pokemonData.id}`);
    info.innerHTML = '';
    info.innerHTML = infoP(number, type, pokemonData ,abilities);
}

/**
 * Formats the Pokémon ID into a three-digit number string.
 *
 * - Adds leading zeros to the number if necessary.
 *
 * @param {string} number The Pokémon ID to format.
 * @returns {string} The formatted number as a string.
 */
function formatNumber(number){
    if (number.length === 1) {
        number = "00" + number;
    } else if (number.length === 2) {
        number = "0" + number;
    }else if (number.length === 3) {
        number = number;
    }
    return number;
}

/**
 * Updates the information section with the species news.
 *
 * - Removes bold formatting from previous elements.
 * - Highlights the current news element.
 * - Displays the species news text.
 * 
 * @param {Object} speciesData The data of the species to display news for.
 */
function news(speciesData) {
    removeBloud(speciesData);
    let news = document.getElementById(`news${speciesData.id}`);
    news.classList.add('bold');
    let info = document.getElementById(`info${speciesData.id}`);
    let pokNews = `${speciesData.flavor_text_entries[2].flavor_text}`;
    info.innerHTML = '';
    info.innerHTML = `${pokNews}`;
}

/**
 * Updates the information section with the Pokémon stats.
 *
 * - Removes bold formatting from previous elements.
 * - Highlights the current stats element.
 * - Displays the Pokémon stats.
 *
 * @param {Object} pokemonData The data of the Pokémon to display stats for.
 */
function stats(pokemonData) {
    removeBloud(pokemonData);
    let stats = document.getElementById(`stats${pokemonData.id}`);
    stats.classList.add('bold');
    stat(pokemonData);
}

/**
 * Displays the stats of a Pokémon in a table format.
 *
 * - Retrieves the stats of the Pokémon.
 * - Updates the HTML content of the information section.
 *
 * @param {Object} pokemonData The data of the Pokémon to display stats for.
 */
function stat(pokemonData){
    let stat = pokemonData.stats.map(loadStats).join('');
    let info = document.getElementById(`info${pokemonData.id}`);
    info.innerHTML = '';
    info.innerHTML = `
    <table class="tableBar">  
            ${stat}
    </table>`;
}

/**
 * Updates the information section with the Pokémon evolution chain.
 *
 * - Removes bold formatting from previous elements.
 * - Highlights the current evolution element.
 * - Loads and displays the evolution chain.
 *
 * @param {Object} speciesData The data of the species to display the evolution chain for.
 */
function evolution(speciesData) {
    removeBloud(speciesData);
    let evolution = document.getElementById(`evolution${speciesData.id}`);
    evolution.classList.add('bold');
    let evolutionUrl = speciesData.evolution_chain.url;
    let info = document.getElementById(`info${speciesData.id}`);
    info.innerHTML = '';
    loadEvolutionChain(evolutionUrl, `info${speciesData.id}`);
}

/**
 * Loads the Pokémon evolution chain and displays it.
 *
 * - Fetches the evolution chain data from the given URL.
 * - Retrieves and displays the evolutions with images.
 *
 * @param {string} evolutionUrl The URL to fetch the evolution chain data from.                            
 * @param {string} elementId The ID of the HTML element to display the evolution chain in.
 */
function loadEvolutionChain(evolutionUrl, elementId) {
    fetch(evolutionUrl)
        .then(response => response.json())
        .then(evolutionData => {
            let evolutions = getEvolutionsWithImages(evolutionData.chain);
            Promise.all(evolutions).then(results => {
                let evolutionContainer = document.getElementById(elementId);
                evolutionContainer.innerHTML = results.join('');
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Evolutionskette:', error));
}

/**
 * Retrieves the evolutions and their images from the evolution chain.
 *
 * - Fetches the data for each evolution stage.
 * - Returns the HTML content for the evolution stages.
 *
 * @param {Object} chain The evolution chain data.
 * @returns {Array<Promise<string>>} An array of promises that resolve to HTML content for each evolution stage.
 */
function getEvolutionsWithImages(chain) {
    let evolutions = [];
    let current = chain;
    while (current) {
        let speciesUrl = current.species.url.replace('pokemon-species', 'pokemon');
        evolutions.push(fetch(speciesUrl)
            .then(response => response.json())
            .then(pokemonData => {
                let imgUrl = pokemonData.sprites.other.home.front_default;
                return `<div class="evolution-step">
                            <p>${pokemonData.name}</p>
                            <img src="${imgUrl}" class="evoPic" alt="${pokemonData.name}">
                        </div>`;
            }));
        current = current.evolves_to[0];
    }
    return evolutions;
}

/**
 * Displays the basic information of a Pokémon.
 *
 * - Removes bold formatting from previous elements.
 * - Retrieves and displays the basic information of the Pokémon.
 *
 * @param {Object} pokemonData The data of the Pokémon to display.
 */
function show(pokemonData) {
    removeBloud(pokemonData);
    getInfo(pokemonData);
    let show = document.getElementById(`show${pokemonData.id}`);
    show.classList.add('bold');
}

/**
 * Removes bold formatting from elements associated with a species.
 *
 * - Removes the 'bold' class from show, news, stats, and evolution elements.
 *
 * @param {Object} speciesData The data of the species to remove bold formatting from.
 */
function removeBloud(speciesData) {
    let show = document.getElementById(`show${speciesData.id}`);
    show.classList.remove('bold');
    let news = document.getElementById(`news${speciesData.id}`);
    news.classList.remove('bold');
    let stats = document.getElementById(`stats${speciesData.id}`);
    stats.classList.remove('bold');
    let evolution = document.getElementById(`evolution${speciesData.id}`);
    evolution.classList.remove('bold');
}

