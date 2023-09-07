let pokemonRepository = (() => {
  let pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.error('Invalid Pokémon data');
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list');
    let column = document.createElement('div');
    column.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
    let card = document.createElement('div');
    card.classList.add('card');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#pokemonModal');
    card.appendChild(button);
    column.appendChild(card);
    pokemonListElement.appendChild(column);
    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      showModal(pokemon);
    });
  }
  function showModal(pokemon) {
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    modalBody.appendChild(createElement('h1', pokemon.name));
    modalBody.appendChild(createElement('p', 'Height: ' + pokemon.height));
    let imageElement = createElement('img');
    imageElement.src = pokemon.imageUrl;
    modalBody.appendChild(imageElement);
  }

  async function loadList() {
    showLoadingMessage();
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      json.results.forEach((item) => {
        add({name: item.name, detailsUrl: item.url});
      });
    } catch (error) {
      console.error(error);
    }
    hideLoadingMessage();
  }

  async function loadDetails(item) {
    let url = item.detailsUrl;
    showLoadingMessage();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unable to fetch data: ${response.statusText}`);
      }
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
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    modalBody.appendChild(createElement('h1', pokemon.name));
    modalBody.appendChild(createElement('p', 'Height: ' + pokemon.height));
    let imageElement = createElement('img');
    imageElement.src = pokemon.imageUrl;
    modalBody.appendChild(imageElement);
  }

  function createElement(tag, text) {
    let element = document.createElement(tag);
    if (text) element.innerText = text;
    return element;
  }

  function showLoadingMessage() {
    let loadingMessage = createElement(
      'p',
      'Loading data from the Pokémon API...'
    );
    document.body.appendChild(loadingMessage);
  }

  function hideLoadingMessage() {
    document.querySelector('p').remove();
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

document.getElementById('searchBar').addEventListener('keyup', (e) => {
  let searchString = e.target.value.toLowerCase();
  let filteredPokemon = pokemonRepository.getAll().filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchString);
  });
  document.querySelector('.pokemon-list').innerHTML = '';
  filteredPokemon.forEach((pokemon) => {
    pokemonRepository.addListItem(pokemon);
  });
});

// Rest of your script will go here

document.getElementById('homeButton').addEventListener('click', returnToHome);

function showErrorMessage(message) {
  const errorMessageElement = document.createElement('div');
  errorMessageElement.classList.add('error-message');
  errorMessageElement.innerText = message;
  document.querySelector('body').appendChild(errorMessageElement);
  setTimeout(() => {
    errorMessageElement.remove();
  }, 3000);
}

function hideLoadingMessage() {
  const loadingMessageElement = document.querySelector('.loading-message');
  if (loadingMessageElement) {
    loadingMessageElement.remove();
  }
}
