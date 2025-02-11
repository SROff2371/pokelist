let currentUser = null;
let allPokemons = [];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if ((username === "_SR_Off_" && password === "Klim35700132.") || (username === "invite" && password === "invite")) {
        currentUser = username;
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("content").classList.remove("hidden");
        loadPokemonTables();
    } else {
        alert("Identifiants incorrects");
    }
}

async function fetchAndDisplayPokemon(apiUrl, generation) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let pokemonList = [];

        for (const pokemonEntry of data.pokemon_species) {
            const pokemonUrl = pokemonEntry.url;
            const pokemonResponse = await fetch(pokemonUrl);
            const pokemonData = await pokemonResponse.json();

            const pokedexNumber = pokemonData.id;
            const pokemonNameFR = pokemonData.names.find(n => n.language.name === "fr")?.name || pokemonData.name;
            const pokemonNameEN = pokemonData.names.find(n => n.language.name === "en")?.name || pokemonData.name;
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`;

            pokemonList.push({ pokedexNumber, pokemonNameFR, pokemonNameEN, imageUrl });
        }

        pokemonList.sort((a, b) => a.pokedexNumber - b.pokedexNumber);

        let tableHtml = `<h2>${generation}ᵉ Génération</h2>
            <table>
            <thead>
                <tr>
                    <th class='rounded-left'>✔️/❌</th>
                    <th>Image</th>
                    <th>Numéro</th>
                    <th>Nom (FR)</th>
                    <th class='rounded-right'>Nom (EN)</th>
                </tr>
            </thead>
            <tbody>`;

        pokemonList.forEach(pokemon => {
            const isChecked = localStorage.getItem(`pokemon-${pokemon.pokedexNumber}`) === "true";
            let checkboxOrSymbol = currentUser === "_SR_Off_" 
                ? `<input type='checkbox' class='pokemon-checkbox rounded-left' data-id='${pokemon.pokedexNumber}' ${isChecked ? "checked" : ""}>`
                : (isChecked ? "✅" : "❌");

            tableHtml += `
                <tr class='pokemon-row' data-name-fr='${pokemon.pokemonNameFR.toLowerCase()}' data-name-en='${pokemon.pokemonNameEN.toLowerCase()}' data-id='${pokemon.pokedexNumber}'>
                    <td>${checkboxOrSymbol}</td>
                    <td><img src="${pokemon.imageUrl}" class="pokemon-image" alt="${pokemon.pokemonNameFR}"></td>
                    <td>${pokemon.pokedexNumber}</td>
                    <td>${pokemon.pokemonNameFR}</td>
                    <td class='rounded-right'>${pokemon.pokemonNameEN}</td>
                </tr>`;
        });

        tableHtml += `</tbody></table>`;
        document.getElementById("pokemon-tables").innerHTML += tableHtml;
        allPokemons = pokemonList;

        updateCheckboxCounts();

        if (currentUser === "_SR_Off_") {
            document.querySelectorAll(".pokemon-checkbox").forEach(checkbox => {
                checkbox.addEventListener("change", function () {
                    const pokemonId = this.getAttribute("data-id");
                    localStorage.setItem(`pokemon-${pokemonId}`, this.checked ? "true" : "false");
                    updateCheckboxCounts();
                });
            });
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des données :`, error);
    }
}

function loadPokemonTables() {
    document.getElementById("pokemon-tables").innerHTML = "";
    fetchAndDisplayPokemon("https://pokeapi.co/api/v2/generation/2", 2);
    fetchAndDisplayPokemon("https://pokeapi.co/api/v2/generation/3", 3);
    fetchAndDisplayPokemon("https://pokeapi.co/api/v2/generation/4", 4);
    fetchAndDisplayPokemon("https://pokeapi.co/api/v2/generation/5", 5);
}

function updateCheckboxCounts() {
    const totalCount = document.querySelectorAll(".pokemon-row").length;
    let checkedCount = 0;
    let uncheckedCount = 0;

    document.querySelectorAll(".pokemon-row").forEach(row => {
        const pokemonId = row.getAttribute("data-id");
        const isChecked = localStorage.getItem(`pokemon-${pokemonId}`) === "true";
        
        if (isChecked) {
            checkedCount++;
        } else {
            uncheckedCount++;
        }
    });

    // Mise à jour des éléments affichant les comptes
    document.getElementById("total-count").textContent = totalCount;
    document.getElementById("checked-count").textContent = checkedCount;
    document.getElementById("unchecked-count").textContent = uncheckedCount;
}

function searchPokemons() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".pokemon-row").forEach(row => {
        const nameFR = row.getAttribute("data-name-fr");
        const nameEN = row.getAttribute("data-name-en");
        const pokedexNumber = row.getAttribute("data-id");

        if (nameFR.includes(searchTerm) || nameEN.includes(searchTerm) || pokedexNumber.includes(searchTerm)) {
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    });
}

function filterPokemon(type) {
    document.querySelectorAll(".pokemon-row").forEach(row => {
        const pokemonId = row.getAttribute("data-id");
        const isChecked = localStorage.getItem(`pokemon-${pokemonId}`) === "true";

        if (type === "checked" && !isChecked) {
            row.classList.add("hidden");
        } else if (type === "unchecked" && isChecked) {
            row.classList.add("hidden");
        } else {
            row.classList.remove("hidden");
        }
    });
}
