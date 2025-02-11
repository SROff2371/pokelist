const { json } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Exemple de données (tu pourrais les charger depuis un fichier JSON)
let pokemons = [
  { "id": 1, "name": "Bulbizarre" },
  { "id": 2, "name": "Herbizarre" },
  // Ajouter plus de Pokémon ici
];

// Fonction pour obtenir tous les Pokémon
app.get('/api/pokemons', (req, res) => {
  res.json(pokemons);
});

// Fonction pour ajouter un Pokémon
app.post('/api/pokemons', (req, res) => {
  const newPokemon = req.body;
  pokemons.push(newPokemon);

  // Enregistrer les données dans un fichier JSON
  fs.writeFileSync('pokemons.json', JSON.stringify(pokemons, null, 2));

  res.status(201).json(newPokemon);
});

// Démarrer l'API
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
