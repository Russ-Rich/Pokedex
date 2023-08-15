let pokemonRepository = (function () {
	let pokemonList = [];
	const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

	function add(pokemon) {
		if (typeof pokemon === "object" && "name" in pokemon) {
			pokemonList.push(pokemon);
		} else {
			console.error("Invalid Pokémon data");
		}
	}

	function getAll() {
		return pokemonList;
	}

	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let column = document.createElement("div");
		column.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4"); // Change column size as needed
		let card = document.createElement("div");
		card.classList.add("card");
		let button = document.createElement("button");
		button.innerText = pokemon.name;
		button.classList.add("btn", "btn-primary");
		button.setAttribute("data-toggle", "modal");
		button.setAttribute("data-target", "#pokemonModal");
		card.appendChild(button);
		column.appendChild(card);
		pokemonList.appendChild(column);
		button.addEventListener("click", function () {
			showDetails(pokemon);
		});
	}


	async function loadList() {
		showLoadingMessage();
		try {
			const response = await fetch(apiUrl);
			const json = await response.json();
			json.results.forEach((item) => {
				add({ name: item.name, detailsUrl: item.url });
			});
		} catch (e) {
			console.error(e);
		}
		hideLoadingMessage();
	}

	async function loadDetails(item) {
		let url = item.detailsUrl;
		showLoadingMessage();
		try {
			const response = await fetch(url);
			const details = await response.json();
			item.imageUrl = details.sprites.front_default;
			item.height = details.height;
			item.types = details.types;
		} catch (e) {
			console.error(e);
		}
		hideLoadingMessage();
	}

	function showDetails(pokemon) {
		loadDetails(pokemon).then(() => {
			showModal(pokemon);
		});
	}

	function showModal(pokemon) {
		let modalBody = document.querySelector(".modal-body");
		modalBody.innerHTML = "";
		modalBody.appendChild(createElement("h1", pokemon.name));
		modalBody.appendChild(createElement("p", "Height: " + pokemon.height));
		let imageElement = createElement("img");
		imageElement.src = pokemon.imageUrl;
		modalBody.appendChild(imageElement);
	}

	function createElement(tag, text) {
		let element = document.createElement(tag);
		if (text) element.innerText = text;
		return element;
	}

	function showLoadingMessage() {
		let loadingMessage = createElement("p", "Loading data from the Pokémon API...");
		document.body.appendChild(loadingMessage);
	}

	function hideLoadingMessage() {
		document.querySelector("p").remove();
	}

	return {
		add,
		getAll,
		addListItem,
		showDetails,
		loadList,
		loadDetails,
	};
})();

pokemonRepository.loadList().then(() => {
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});
document.getElementById("searchBar").addEventListener("keyup", (e) => {
	let searchString = e.target.value.toLowerCase();
	let filteredPokemon = pokemonRepository.getAll().filter((pokemon) => {
		return pokemon.name.toLowerCase().includes(searchString);
	});
	document.querySelector(".pokemon-list").innerHTML = "";
	filteredPokemon.forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});

/// Function to populate the grid with Pokémon thumbnails
function populateGrid(pokemonList) {
  // Getting the grid container element from the DOM
  const gridContainer = document.getElementById('grid-container');

  // Iterating through the Pokémon list
  pokemonList.forEach(pokemon => {
    // Fetching details for each Pokémon from their specific URL
    fetch(pokemon.url)
      .then(response => response.json())
      .then(details => {
        // Creating a grid box for each Pokémon
        const gridBox = document.createElement('div');
        gridBox.className = 'grid-box';

        // Creating an image element for the Pokémon thumbnail
        const thumbnail = document.createElement('img');
        thumbnail.src = details.sprites.front_default; // Getting the image from the details
        thumbnail.alt = details.name;
        thumbnail.className = 'thumbnail';

        // Creating a heading element for the Pokémon name
        const name = document.createElement('h3');
        name.textContent = details.name;

        // Appending the thumbnail and name to the grid box
        gridBox.appendChild(thumbnail);
        gridBox.appendChild(name);

        // Appending the grid box to the grid container
        gridContainer.appendChild(gridBox);
      })
      .catch(error => console.error(`An error occurred fetching ${pokemon.name}:`, error));
  });
}

// Fetching the initial Pokémon data from the API
fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
  .then(response => response.json())
  .then(data => populateGrid(data.results)) // Calling the populateGrid function with the results
  .catch(error => console.error('An error occurred:', error));

// Function to filter the grid based on the search input
function filterGrid() 
{
	// Getting the search input and converting it to lowercase
	const searchInput = document.getElementById('search-input').value.toLowerCase();

	// Getting all the grid boxes
	const gridBoxes = document.querySelectorAll('.grid-box');

	// Iterating through the grid boxes
	gridBoxes.forEach(gridBox => {
		// Getting the name of the Pokémon from the heading element
		const name = gridBox.querySelector('h3').textContent.toLowerCase();

		// Checking if the name includes the search input
		if (name.includes(searchInput)) {
			// If it does, display the grid box
			gridBox.style.display = 'block';
		} else {
			// If it doesn't, hide the grid box
			gridBox.style.display = 'none';
		}
	});
}

function returnToHome() {
	document.getElementById("searchBar").value = "";
	document.querySelector(".pokemon-list").innerHTML = "";
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
}

document.getElementById("homeButton").addEventListener("click", returnToHome);

