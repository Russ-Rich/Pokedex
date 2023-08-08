let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

	function add(pokemon) {
		pokemonList.push(pokemon);
	}

	function getAll() {
		return pokemonList;
	}

	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		listItem.classList.add("list-group-item");
		let button = document.createElement("button");
		button.innerText = pokemon.name;
		button.classList.add("btn", "btn-primary");
		button.setAttribute("data-toggle", "modal");
		button.setAttribute("data-target", "#pokemonModal");
		listItem.appendChild(button);
		pokemonList.appendChild(listItem);
		button.addEventListener("click", function () {
			showDetails(pokemon);
		});
	}

	function loadList() {
		showLoadingMessage();
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
				});
				hideLoadingMessage();
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage();
			});
	}

	function loadDetails(item) {
		let url = item.detailsUrl;
		showLoadingMessage();
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.imageUrl = details.sprites.front_default;
				item.height = details.height;
				item.types = details.types;
				hideLoadingMessage();
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage();
			});
	}

	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}

	function showModal(pokemon) {
		let modalBody = document.querySelector(".modal-body");
		modalBody.innerHTML = "";

		let titleElement = document.createElement("h1");
		titleElement.innerText = pokemon.name;

		let contentElement = document.createElement("p");
		contentElement.innerText = "Height: " + pokemon.height;

		let imageElement = document.createElement("img");
		imageElement.src = pokemon.imageUrl;

		modalBody.appendChild(titleElement);
		modalBody.appendChild(contentElement);
		modalBody.appendChild(imageElement);
	}

	function showLoadingMessage() {
		let loadingMessage = document.createElement("p");
		loadingMessage.innerText = "Loading data from the Pokémon API...";
		document.body.appendChild(loadingMessage);
	}

	function hideLoadingMessage() {
		document.querySelector("p").remove();
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showDetails: showDetails,
		loadList: loadList,
		loadDetails: loadDetails,
	};
})();

pokemonRepository.loadList().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
