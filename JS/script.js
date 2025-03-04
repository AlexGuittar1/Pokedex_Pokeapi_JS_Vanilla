
// CONSTANTES Y VARIABLES GLOBALES

const urlPokemons = "https://pokeapi.co/api/v2/pokemon/";
const urlTypePokemons = "https://pokeapi.co/api/v2/type/";
const urlImgPokemonDetail = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
const urlImgPokemonFull = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";

let nextUrl = null;
let previousUrl = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let allPokemonList = [];
let allPokemonNames = [];
let historyStack = [];
let currentState = { type: 'main', url: urlPokemons };
let offset = 0;
const limit = 20;

const main = document.querySelector('.main');
const searchInput = document.getElementById('idPokemon');
const searchSelect = document.getElementById('search__select');
const loadMoreButton = document.getElementById('load-more');
const importButton = document.getElementById('import__button');
const importFileInput = document.getElementById('import-file');

// INICIALIZACIÓN DE DATOS

function goToHome() {
    historyStack = [];
    loadPokemons();
    history.pushState({ type: 'main', url: urlPokemons }, '', window.location.href);
}

fetch(urlTypePokemons)
    .then(response => response.json())
    .then(data => {
        const sortedTypes = data.results.sort((a, b) => a.name.localeCompare(b.name));
        searchSelect.innerHTML = '<option value="">Search For Type</option>';
        sortedTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            searchSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error loading types:', error);
        searchSelect.innerHTML = '<option value="">Error loading types</option>';
    });

fetch(urlPokemons + '?limit=1000')
    .then(response => response.json())
    .then(data => {
        allPokemonList = data.results;
        allPokemonNames = data.results.map(pokemon => pokemon.name);
    })
    .catch(error => console.error('Error loading Pokémon:', error));
    
const homeButton = document.getElementById('home-button');
homeButton.addEventListener('click', goToHome);
document.getElementById('backButton').addEventListener('click', goToHome);

// FUNCIONES DE BÚSQUEDA

function showSuggestions(input) {
    const suggestionsContainer = document.getElementById('suggestions');
    const searchInput = document.getElementById('idPokemon');

    suggestionsContainer.innerHTML = '';

    if (input.length > 0) {
        const filtered = allPokemonNames.filter(name =>
            name.toLowerCase().includes(input.toLowerCase())
        );

        if (filtered.length > 0) {
            filtered.forEach(name => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = name;
                div.addEventListener('click', () => {
                    searchInput.value = name;
                    suggestionsContainer.style.display = 'none';
                    performSearch(name);
                });
                suggestionsContainer.appendChild(div);
            });

            const inputRect = searchInput.getBoundingClientRect();
            suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainer.style.width = `${inputRect.width}px`;
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function performSearch(term) {
    const searchTerm = term.toLowerCase().trim();
    let searchResults = [];

    if (searchTerm === '') {
        loadPokemons();
        return;
    }

    searchResults = allPokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    // Ordenar los resultados por ID
    searchResults.sort((a, b) => {
        const idA = parseInt(a.url.split('/').slice(-2, -1)[0]);
        const idB = parseInt(b.url.split('/').slice(-2, -1)[0]);
        return idA - idB;
    });

    main.innerHTML = searchResults.length > 0 ? '' : '<div class="error">No Pokémon found</div>';

    searchResults.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(createPokemonCard)
            .catch(error => console.error('Error loading Pokémon:', error));
    });

    history.pushState({ type: 'search', term: searchTerm }, '', window.location.href);
    document.getElementById('suggestions').style.display = 'none';
}

// MANEJO DE EVENTOS

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

document.getElementById('search__button').addEventListener('click', () => {
    performSearch(searchInput.value);
});

// MANEJO DE POKÉMON Y TARJETAS

function loadPokemons(url) {
    if (!url) url = urlPokemons + '?offset=0&limit=20';

    main.innerHTML = '<div class="loading">Loading Pokémon...</div>';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            main.innerHTML = '';
            nextUrl = data.next;
            previousUrl = data.previous;

            const sortedPokemons = data.results.sort((a, b) => {
                const idA = parseInt(a.url.split('/').slice(-2, -1)[0]);
                const idB = parseInt(b.url.split('/').slice(-2, -1)[0]);
                return idA - idB;
            });

            sortedPokemons.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(createPokemonCard)
                    .catch(error => console.error('Error loading Pokémon:', error));
            });

            history.pushState({ type: 'main', url: url }, '', window.location.href);
        })
        .catch(error => {
            main.innerHTML = '<div class="error">Error loading Pokémon. Please try again.</div>';
            console.error('API Error:', error);
        });
}

// FUNCIÓN PARA CREAR TARJETA 

function createPokemonCard(pokemon) {
    const { id, name, types, stats } = pokemon;
    const type = types[0].type.name;
    const isFavorite = favorites.some(fav => fav.id === id);
    const idFormatted = id.toString().padStart(3, '0');

    const card = document.createElement('div');
    card.className = `card ${type}`;
    card.style.cursor = 'pointer';
    card.innerHTML = `
        <img src="${urlImgPokemonDetail}${idFormatted}.png" 
             alt="${name}" 
             class="card-img"
             onerror="this.src='img/placeholder.png'">
        <div class="card-body">
            <button class="favorite-heart ${isFavorite ? 'favorited' : ''}"></button>
            <h5>#${idFormatted}</h5>
            <h1>${name}</h1>
            <div class="card-type">
                ${types.map(t => `<img src="img/icon/${t.type.name}.svg" class="type-icon">`).join('')}
            </div>
        </div>
    `;

    main.appendChild(card);
    addCardEvents(card, pokemon);
}

function updateHistory(state) {
    historyStack.push(JSON.parse(JSON.stringify(currentState)));
    currentState = state;
}

function handleBack() {
    if (historyStack.length > 0) {
        const prevState = historyStack.pop();
        currentState = prevState;
        main.innerHTML = '';
        if (prevState.type === 'main') {
            loadPokemons(prevState.url);
        } else if (prevState.type === 'favorites') {
            showFavorites();
        } else if (prevState.type === 'search') {
            performSearch(prevState.term);
        } else if (prevState.type === 'filter') {
            filterByType(prevState.filterType);
        }
    } else {
        loadPokemons();
    }
}

// MANEJO DE FAVORITOS

function toggleFavorite(pokemon, heart) {
    const index = favorites.findIndex(fav => fav.id === pokemon.id);

    if (index === -1) {
        favorites.push(pokemon);
        heart.classList.add('favorited');
    } else {
        favorites.splice(index, 1);
        heart.classList.remove('favorited');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function showFavorites() {
    main.innerHTML = '';
    if (favorites.length === 0) {
        main.innerHTML = '<div class="info">No favorites yet</div>';
    } else {
        favorites.forEach(createPokemonCard);
    }
}

// MANEJO DE HISTORIAL Y NAVEGACIÓN

function addCardEvents(card, pokemon) {
    const heart = card.querySelector('.favorite-heart');

    card.addEventListener('click', () => showDetailsModal(pokemon));
    heart.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(pokemon, heart);
    });
}

function showDetailsModal(pokemon) {
    const modal = document.createElement('div');
    const type = pokemon.types[0].type.name;
    modal.className = `modal ${type}`;
    modal.style.display = 'block';

    const idFormatted = pokemon.id.toString().padStart(3, '0');

    const statsNames = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        speed: 'Speed'
    };

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${pokemon.name.toUpperCase()}</h2>
            <img src="${urlImgPokemonFull}${idFormatted}.png" 
                 alt="${pokemon.name}" 
                 style="width: 200px; margin: 15px auto;"
                 onerror="this.src='img/placeholder.png'">
            
            <div class="stats-container">
                ${pokemon.stats.map(stat => `
                    <div class="stat-bar">
                        <span class="stat-name">${statsNames[stat.stat.name]}</span>
                        <div class="bar-container">
                            <div class="bar" style="width: ${(stat.base_stat / 150) * 100}%"></div>
                            <span class="stat-value">${stat.base_stat}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="details-info">
                <p>Height: ${pokemon.height / 10}m</p>
                <p>Weight: ${pokemon.weight / 10}kg</p>
                <p>Types: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
window.addEventListener('popstate', (event) => {
    if (event.state) {
        const state = event.state;

        if (state.type === 'main') {
            loadPokemons(state.url);
        } else if (state.type === 'search') {
            performSearch(state.term);
        } else if (state.type === 'filter') {
            filterByType(state.filterType);
        } else if (state.type === 'favorites') {
            showFavorites();
        }
    } else {
        loadPokemons();
    }
});

searchInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 1) {
        showSuggestions(searchInput.value);
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search')) {
        document.getElementById('suggestions').style.display = 'none';
    }
});

document.getElementById('search__button').addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) return;

    updateHistory({ type: 'search', term: searchTerm });

    fetch(`${urlPokemons}${searchTerm}`)
        .then(response => {
            if (!response.ok) throw new Error('Not found');
            return response.json();
        })
        .then(data => {
            main.innerHTML = '';
            createPokemonCard(data);
        })
        .catch(() => {
            main.innerHTML = '<div class="error">Pokémon not found</div>';
        });
});

searchSelect.addEventListener('change', () => {
    const type = searchSelect.value;
    if (!type) return loadPokemons();

    updateHistory({ type: 'filter', filterType: type });
    filterByType(type);
});

function filterByType(type) {
    fetch(`${urlTypePokemons}${type}`)
        .then(response => response.json())
        .then(data => {
            main.innerHTML = '';
            const sortedPokemons = data.pokemon.sort((a, b) => {
                const idA = parseInt(a.pokemon.url.split('/').slice(-2, -1)[0]);
                const idB = parseInt(b.pokemon.url.split('/').slice(-2, -1)[0]);
                return idA - idB;
            });

            sortedPokemons.forEach(p => {
                fetch(p.pokemon.url)
                    .then(response => response.json())
                    .then(createPokemonCard);
            });
            history.pushState({ type: 'filter', filterType: type }, '', window.location.href);
        });
}

// FUNCIÓN PARA CARGAR MÁS POKÉMON

function loadMorePokemons() {
    offset += limit;
    const url = `${urlPokemons}?offset=${offset}&limit=${limit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(createPokemonCard)
                    .catch(error => console.error('Error loading Pokémon:', error));
            });
        })
        .catch(error => {
            console.error('Error loading more Pokémon:', error);
        });
}

loadMoreButton.addEventListener('click', loadMorePokemons);

document.getElementById('favorites__button').addEventListener('click', () => {
    updateHistory({ type: 'favorites' });
    showFavorites();
});

document.getElementById('backButton').addEventListener('click', handleBack);


document.getElementById('export__button').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(favorites)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
});

importButton.addEventListener('click', () => {
    importFileInput.click();
});

importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedFavorites = JSON.parse(e.target.result);
                if (Array.isArray(importedFavorites)) {
                    favorites = importedFavorites;
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    showFavorites();
                    alert('Favorites imported successfully!');
                } else {
                    alert('Invalid JSON format. Please upload a valid favorites file.');
                }
            } catch (error) {
                alert('Error parsing JSON file. Please upload a valid favorites file.');
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please upload a valid .json file.');
    }
});

loadPokemons();