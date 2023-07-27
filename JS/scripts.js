// Creating a Pokemon Repository inside an IIFE
let pokemonRepository = (function () {
	// Pokemon list array
	let pokemonList = [
		{ name: "Bulbasaur", height: 7, types: ["grass", "poison"] },
		{ name: "Charmander", height: 6, types: ["fire"] },
		{ name: "Charizard", height: 17, types: ["fire", "flying"] },
		{ name: "Pikachu", height: 4, types: ["electric"] },
		{ name: "Squirtle", height: 5, types: ["water"] },
		{ name: "Jigglypuff", height: 5, types: ["normal", "fairy"] },
		{ name: "Mewtwo", height: 20, types: ["psychic"] },
		{ name: "Mew", height: 4, types: ["psychic"] },
		{ name: "Gengar", height: 15, types: ["ghost", "poison"] },
		{ name: "Gyarados", height: 21, types: ["water", "flying"] },
		{ name: "Dragonite", height: 22, types: ["dragon", "flying"] },
		{ name: "Eevee", height: 3, types: ["normal"] },

	];

	// Function to return all Pokemon
	function getAll() {
		return pokemonList;
	}

	// Function to add a new Pokemon
	function add(pokemon) {
		pokemonList.push(pokemon);
	}

	// Function to add a list item
	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		let button = document.createElement("button");
		button.innerText = pokemon.name;
		button.classList.add("button-class");
		listItem.appendChild(button);
		pokemonList.appendChild(listItem);
		button.addEventListener("click", function () {
			showDetails(pokemon);
		});
	}

	// Function to show Pokemon details
	function showDetails(pokemon) {
		console.log(pokemon);
	}

	// Returning public functions
	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showDetails: showDetails,
	};
})();

// Looping each Pokemon and creating a list item
pokemonRepository.getAll().forEach(function (pokemon) {
	pokemonRepository.addListItem(pokemon);
});
