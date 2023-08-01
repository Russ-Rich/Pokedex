let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
	let modalContainer = document.querySelector("#modal-container");

	function add(pokemon) {
		pokemonList.push(pokemon);
	}

	function getAll() {
		return pokemonList;
	}

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
		modalContainer.innerHTML = "";
		let modal = document.createElement("div");
		modal.classList.add("modal");

		let closeButtonElement = document.createElement("button");
		closeButtonElement.classList.add("modal-close");
		closeButtonElement.innerText = "Close";
		closeButtonElement.addEventListener("click", hideModal);

		let titleElement = document.createElement("h1");
		titleElement.innerText = pokemon.name;

		let contentElement = document.createElement("p");
		contentElement.innerText = "Height: " + pokemon.height;

		let container = document.createElement("div");
		container.classList.add("img-container");
		let imageElement = document.createElement("img");
		imageElement.src = pokemon.imageUrl;

		modal.appendChild(closeButtonElement);
		modal.appendChild(titleElement);
		modal.appendChild(contentElement);
		container.appendChild(imageElement);
		modal.appendChild(container);
		modalContainer.appendChild(modal);
		modalContainer.classList.add("is-visible");

		var el = document.querySelector(".modal");

		swipedetect(el, function (swipedir) {
			if (swipedir == "left") {
				console.log("You just swiped left!");
				// Add the logic for previous pokemon
			} else if (swipedir == "right") {
				console.log("You just swiped right!");
				// Add the logic for next pokemon
			}
		});
	}

	function hideModal() {
		modalContainer.classList.remove("is-visible");
	}

	function showLoadingMessage() {
		let loadingMessage = document.createElement("p");
		loadingMessage.innerText = "Loading data from the Pokémon API...";
		document.body.appendChild(loadingMessage);
	}

	function hideLoadingMessage() {
		document.querySelector("p").remove();
	}

	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
			hideModal();
		}
	});

	modalContainer.addEventListener("click", (e) => {
		var target = e.target;
		if (target === modalContainer) {
			hideModal();
		}
	});

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
