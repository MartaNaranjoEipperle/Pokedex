/**
 * Creates HTML for a Pokémon card with the given index.
 *
 * - Generates a `div` element with an `id` based on the provided index.
 * - Includes placeholders for the Pokémon's photo, type, and name.
 *
 * @param {number} index The index to be used for creating unique IDs for elements.
 * @returns {string} The HTML string for the Pokémon card.
 */
function createCardHTML(index) {
    return `
        <div id="cardPicture${index}" class="card" onclick="bigCard()"> 
            <div class="pokemon">
                <div class="photo" id="picture${index}"></div>
                <div id="type${index}"></div>
            </div>
            <div id="pokemon${index}"></div>
        </div>`;
}

/**
 * Creates HTML for the detailed view of a Pokémon card.
 *
 * - Generates a `div` for the front view of the Pokémon card with navigation buttons.
 * - Includes sections for the Pokémon's photo, name, and interaction buttons.
 *
 * @param {number} i The index used to generate unique IDs for elements and navigation.
 * @param {string} frontCard The class for styling the front card.
 * @param {string} name The name of the Pokémon.
 * @param {string} photo The HTML for the Pokémon's photo.
 * @returns {string} The HTML string for the detailed view of the Pokémon card.
 */
function bigCardLoad(i, frontCard, name, photo){
    return `
    <div class="next" onclick="left(${i})"><</div>
    <div id="frontCard${i}" class="${frontCard} bigCard">
        <div class="bigPhoto">${photo}</div>
        <div class="bigName flex-center">${name} <div id="heart${i}" onclick="like(${i})" class="heart"></div></div>
        <div class="script">
            <div class="more">
                <div id="show${i}"class="bold poin" onclick="show()"> About </div>
                <div id="news${i}" onclick="news()" class="poin"> News </div>
                <div id="stats${i}" onclick="stats()" class="poin"> Base Stats </div>
                <div id="evolution${i}" onclick="evolution()" class="poin"> Evolution </div>
            </div>
            <div class="info" id="info${i}"></div>
        </div>
    </div>
    <div class="next" onclick ="right(${i})">></div>`;
}

/**
 * Generates HTML for the Pokémon's information table.
 *
 * - Creates a table displaying the Pokémon's number, types, height, weight, and abilities.
 *

 * @param {string} number The formatted number of the Pokémon.
 * @param {string} type The types of the Pokémon as HTML.
 * @param {Object} pokemonData The Pokémon data including height and weight.
 * @param {string} abilities The abilities of the Pokémon as HTML.
 * @returns {string} The HTML string for the Pokémon's information table.
 */
function infoP(number, type, pokemonData, abilities){
    return`
    <table>
        <tr>
            <td>Number</td>
            <td class="td">#${number}</td>
        </tr>
        <tr>
            <td>Types</td>
            <td class="td">${type}</td>
        </tr>
        <tr>
            <td>Height</td>
            <td class="td">${pokemonData.height} m</td>
        </tr>
        <tr>
            <td>Weight</td>
            <td class="td">${pokemonData.weight} kg</td>
        </tr>
        <tr>
            <td>Abilities</td>
            <td class="td">${abilities}</td>
        </tr>
    </table>`
}

/**
 * Generates HTML for a Pokémon stat row in a table.
 *
 * - Creates a table row displaying the stat name, base stat value, and a visual representation.
 *
 * @param {Object} stat The stat object containing the name and base value.
 * @returns {string} The HTML string for the Pokémon stat row.
 */
function loadStats(stat) {
    let statName = stat.stat.name;
    let baseStat = stat.base_stat;
    return `
        <tr>
            <td>${statName}</td>
            <td class="td">${baseStat}</td>
            <td>
            <div class = "stat-bar-container">
                <div class="stat-bar" style="width: ${baseStat}%"></div>
                </div>
            </td>
        </tr>`;
}