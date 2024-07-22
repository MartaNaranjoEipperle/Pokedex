/**
 * Updates the user's favorite Pokémon list in Firebase.
 *
 * @param {string} id - The ID of the user in Firebase.
 * @param {Array<number>} favorites - The updated list of favorite Pokémon IDs.
 * @returns {Promise<Object>} - A promise that resolves to the updated user data from Firebase.
 */
async function updateUserFavoritesInFirebase(id, favorites) {
    if (loggedInUser) {
        let response = await fetch(`${BASE_URL}/users/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favorites })
        });
        return await response.json();
    }
}

/**
 * Initializes the user's favorite list if it does not exist.
 *
 * @param {Object} user - The user object.
 * @returns {Object} - The initialized user object with a favorites list.
 */
function initializeUser(user) {
    if (!user.favorites) {
        user.favorites = [];
    }
    return user;
}

/**
 * Updates the heart icon to reflect whether the Pokémon is a favorite.
 *
 * @param {number} index - The ID of the Pokémon.
 * @param {boolean} isFavorite - Whether the Pokémon is a favorite or not.
 */
async function updateHeartIcon(index, isFavorite) {
    let heart = document.getElementById('heart' + index);
    if (isFavorite) {
        heart.classList.remove('heart');
        heart.classList.add('red-heart');
    } else {
        heart.classList.add('heart');
        heart.classList.remove('red-heart');
    }
}

/**
 * Toggles the favorite status of a Pokémon.
 *
 * @param {number} index - The ID of the Pokémon.
 * @returns {boolean} - The previous favorite status of the Pokémon.
 */
function toggleFavorite(index) {
    loggedInUser = initializeUser(loggedInUser);
    const isFavorite = loggedInUser.favorites.includes(index);
    
    if (isFavorite) {
        favoriteStatus[index] = false;
        loggedInUser.favorites = loggedInUser.favorites.filter(i => i !== index);
    } else {
        favoriteStatus[index] = true;
        loggedInUser.favorites.push(index);
    }
    
    return isFavorite;
}

/**
 * Displays a login message next to the heart icon if the user is not logged in.
 *
 * @param {number} index - The ID of the Pokémon.
 */
function showLoginMessage(index) {
    let message = document.createElement('span');
    message.textContent = 'LOG IN!';
    message.style.color = 'black';
    message.style.marginLeft = '5px';
    message.style.fontSize = '10px';
    let heart = document.getElementById('heart' + index);
    heart.parentNode.insertBefore(message, heart.nextSibling);
    setTimeout(() => message.remove(), 2000);
}

/**
 * Handles the like (favorite) action for a Pokémon.
 *
 * @param {number} index - The ID of the Pokémon.
 */
async function like(index) {
    if (loginOn) {
        const wasFavorite = toggleFavorite(index);
        updateHeartIcon(index, !wasFavorite);
        await updateUserFavoritesInFirebase(loggedInUser.id, loggedInUser.favorites);
        updateFavoriteCards();
    } else {
        showLoginMessage(index);
    }
}

/**
 * Updates the list of favorite Pokémon cards displayed in the favorites section.
 */
function updateFavoriteCards() {
    let favoriteCard = document.getElementById('favoritePokemons');
    favoriteCard.innerHTML = '';
    if (loggedInUser && Array.isArray(loggedInUser.favorites)) {
        loggedInUser.favorites.forEach(index => {
            let pokemonData = combinedData[index]?.pokemonData;
            let speciesData = combinedData[index]?.speciesData;
            if (pokemonData && speciesData) {
                let myFavorit = document.getElementById('cardPicture' + index);
                let myFavoritHtml = myFavorit ? myFavorit.innerHTML : '';
                let favoriteClass = myFavorit ? myFavorit.classList.value : 'default-class';
                favoriteCard.innerHTML += `<div class="${favoriteClass} flex" id="myFavoritePokemon${index}" onclick='showBigFavoriteCard(${index})'>${myFavoritHtml}</div>`;
            }
        });
    }
}

/**
 * Shows the detailed view of the Pokémon specified by the given index.
 *
 * @param {number} index - The ID of the Pokémon.
 */
function showBigFavoriteCard(index) {
    revealMoreCards();
    let pokemonData = combinedData[index]?.pokemonData;
    let speciesData = combinedData[index]?.speciesData;
    if (pokemonData && speciesData) {
        bigCard(pokemonData, speciesData);
    }
}

