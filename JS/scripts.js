// Start of the Pokemon Repository IIFE
let pokemonRepository = (function () {
	// Array to store all Pokemon
	let pokemonList = [];
	// API url to fetch all Pokemon
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/";

	// Function to add Pokemon to list
	function add(pokemon) {
		pokemonList.push(pokemon);
	}

	// Function to return all Pokemons
	function getAll() {
		return pokemonList;
	}

	// Function to add a list item for each Pokemon
	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		let button = document.createElement("button");
		button.innerText = pokemon.name;
		button.classList.add("pokemon-button");
		listItem.appendChild(button);
		pokemonList.appendChild(listItem);
		button.addEventListener("click", function () {
			showDetails(pokemon);
		});
	}

	// Function to show loading message
	function showLoadingMessage() {
		let loadingMessage = document.querySelector(".loading");
		if (!loadingMessage) {
			loadingMessage = document.createElement("div");
			loadingMessage.innerText = "Loading...";
			loadingMessage.classList.add("loading");
			document.body.appendChild(loadingMessage);
		}
	}

	// Function to hide loading message
	function hideLoadingMessage() {
		let loadingMessage = document.querySelector(".loading");
		if (loadingMessage) {
			document.body.removeChild(loadingMessage);
		}
	}

	// Function to load list of all Pokemon from API
	function loadList() {
		showLoadingMessage(); // Shows loading message before fetch starts
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				// Add each Pokemon from the API to our Pokemon list
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
				});
				hideLoadingMessage(); // Hide loading message after fetch completes
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage(); // Hide loading message if fetch fails
			});
	}

	// Function to load detailed data for Pokemon items
	function loadDetails(item) {
		showLoadingMessage(); // Shows loading message before fetch starts
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				// Assign details from API to Pokemon item
				item.imageUrl = details.sprites.front_default;
				item.height = details.height;
				hideLoadingMessage(); // Hides loading message after fetch completes
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage(); // Hides loading message if fetch fails
			});
	}

	// Function to log the details of Pokemon item
	function showDetails(item) {
		loadDetails(item).then(function () {
			console.log(item); // Log the details of the clicked Pokemon
		});
	}

	// Returns public methods and variables
	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails,
		showDetails: showDetails,
		showLoadingMessage: showLoadingMessage,
		hideLoadingMessage: hideLoadingMessage,
	};
})();

// Load the Pokemon list and then adds list items for each one
pokemonRepository.loadList().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
