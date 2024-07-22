# Pokedex

## Description

This web application allows users to manage their favorite Pokémon. Users can log in, view their favorite Pokémon, and update their favorites. The application interacts with Firebase for user data storage and uses the PokeAPI to fetch Pokémon details.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **Favorite Pokémon Management**: Users can mark Pokémon as favorites and view their favorite Pokémon.
- **Responsive Design**: The application adjusts its layout based on the user's screen size.
- **Dynamic UI Updates**: The application dynamically updates the UI based on user actions and data.

## Technologies Used

- **Firebase**: For user data storage and management.
- **PokeAPI**: For fetching Pokémon details.
- **HTML/CSS/JavaScript**: For the frontend and user interactions.

## Setup and Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/pokemon-favorites.git
    cd pokemon-favorites
    ```

2. **Open the `index.html` File**
    Simply open `https://marta-eipperle.developerakademie.net/developer24/pokedex-01/index.html#` in your browser to view the application.

## Usage

### Register a New User

1. Navigate to the registration form.
2. Enter a username, password, email, and select a profile picture.
3. Click on the "Register" button to create a new account.

### Log In

1. Navigate to the login form.
2. Enter your username and password.
3. Click on the "Log In" button to access your account.

### Manage Favorites

1. Once logged in, you can view Pokémon details by selecting them from the Pokémon selection area.
2. Click on the heart icon to mark a Pokémon as a favorite or to remove it from favorites.
3. View and manage your favorite Pokémon in the favorites section.

### Responsive Design

The application adjusts its layout based on the screen height. If the screen height is below 540px, certain UI elements will be hidden to ensure a better user experience.

## API Endpoints

### Firebase

- **Fetch Users Data**: `https://pokedex-31d32-default-rtdb.europe-west1.firebasedatabase.app/users.json`
- **Save User Data**: `https://pokedex-31d32-default-rtdb.europe-west1.firebasedatabase.app/users.json`

### PokeAPI

- **Fetch Pokémon Details**: `https://pokeapi.co/api/v2/pokemon/{pokemonName}`

## Error Handling

- **User Exists**: If the username or email is already registered, an error message will be displayed.
- **Registration Errors**: Any issues during registration or data saving will be logged to the console.

## Contributing

Feel free to open issues or submit pull requests to improve the project. Contributions are always welcome!
