/**
 * Adds event listeners to the document once it is fully loaded.
 *
 * - Adds an input event listener to the search bar to filter Pokémon as the user types.
 * - Defines helper functions to filter and show all Pokémon cards.
 */
document.addEventListener('DOMContentLoaded', function () {

    /**
     * Filters Pokémon cards based on the search term entered by the user.
     *
     * - Displays cards with names that match the search term.
     * - Hides cards with names that do not match the search term.
     *
     * @param {string} searchTerm The term to filter Pokémon by.
     */
    document.getElementById('searchBar').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length >= 3) {
            filterPokemon(searchTerm);
        } else {
            showAllPokemon();
        }
    });

    /**
     * Filters Pokémon cards to only show those matching the search term.
     *
     * - Calls `getMore` to ensure all cards are available for filtering.
     * - Toggles visibility of each Pokémon card based on whether its name matches the search term.
     *
     * @param {string} searchTerm The term to filter Pokémon by.
     */
    function filterPokemon(searchTerm) {
        getMore();
        for (let i = 1; i <= 250; i++) {
            let card = document.getElementById(`cardPicture${i}`);
            let pokemonName = combinedData[i]?.pokemonData?.name.toLowerCase();
            if (pokemonName && pokemonName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    }

    /**
     * Shows all Pokémon cards by setting their display style to 'block'.
     *
     * - Ensures all Pokémon cards are visible by removing any 'none' display styles.
     */
    function showAllPokemon() {
        for (let i = 1; i <= 250; i++) {
            let card = document.getElementById(`cardPicture${i}`);
            card.style.display = 'block';
        }
    }

});