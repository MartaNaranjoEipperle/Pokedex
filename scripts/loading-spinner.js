/**
 * Displays the loading spinner and hides the cards container.
 *
 * - Sets the display style of the loading spinner to 'block'.
 * - Adds the 'none' class to the cards container to hide it.
*/
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('cards').classList.add('none');
}

/**
 * Hides the loading spinner and displays the cards container.
 *
 * - Sets the display style of the loading spinner to 'none'.
 * - Removes the 'none' class from the cards container to make it visible.
*/
function disableLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('cards').classList.remove('none');
}