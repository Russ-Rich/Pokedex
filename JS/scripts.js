//Start
let pokemonList = [
	{
		name: "Bulbasaur",
		height: 7,
		types: ["grass", "poison"],
	},
	{
		name: "Charmander",
		height: 6,
		types: ["fire"],
	},
	{
		name: "Squirtle",
		height: 5,
		types: ["water"],
	},
];

// New forEach() loop
pokemonList.forEach(function(pokemon) {
	let pokemonName = pokemonList.name;
	let pokemonHeight = pokemonList.height;

	// Initializes output message with name and height
	let outputMessage = pokemonName + " (height: " + pokemonHeight + ")";

	// Conditional check for if the Pokemon is big
	if (pokemonHeight > 6) {
		// If the Pokemon is big, add special message to output
		outputMessage += " - Wow, that’s big!";
	}

	// Whether the Pokemon is big or not, write the output message to the web page
	document.write(outputMessage + "<br>");
});

