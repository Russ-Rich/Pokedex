// Pokemon List
let pokemonRepository = (function () {
	// Initialize list of pokemon
	let pokemonList = [
		{ name: "Bulbasaur", height: 7, types: ["grass", "poison"] },
		{ name: "Charizard", height: 1.7, types: ["fire", "flying"] },
		{ name: "Pikachu", height: 0.4, types: ["electric"] },
	];

	// Function to return all pokemon in list
	function getAll() {
		return pokemonList;
	}

	// Function to add a new pokemon to list with validation
	function add(pokemon) {
		let keys = ["name", "height", "types"];
		let isValidPokemon = keys.every((key) => key in pokemon);

		// Check that pokemon is an object and it has all keys and correct types for values
		if (
			typeof pokemon === "object" &&
			isValidPokemon &&
			typeof pokemon.name === "string" &&
			typeof pokemon.height === "number" &&
			Array.isArray(pokemon.types)
		) {
			// If the pokemon data is valid, add it to the list
			pokemonList.push(pokemon);
		} else {
			// If the data is NOT valid, log error message
			console.log("Invalid Pokemon data");
		}
	}

	// Function to find a pokemon by name
	function findByName(name) {
		return pokemonList.filter((pokemon) => pokemon.name === name);
	}

	// Return our functions for the pokemon repository
	return {
		getAll: getAll,
		add: add,
		findByName: findByName,
	};
})();

// Displays pokemon on webpage
pokemonRepository.getAll().forEach((pokemon) => {
	// Output string with name and height
	let output = `${pokemon.name} (height: ${pokemon.height})`;

	// If the pokemon is taller than 1.0, add a comment to the output string
	if (pokemon.height > 1.0) {
		output += " - Wow, that's big!";
	}

	// Write the output string to the webpage
	document.write(`<p>${output}</p>`);
});
