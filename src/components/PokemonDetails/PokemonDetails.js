import React from "react";
import NotFoundError from "../NotFoundError/NotFoundError";
import { useParams } from "react-router-dom";

function PokemonDetails(props) {
  const [pokemon, setPokemon] = React.useState(null);
  const [error, setError] = React.useState(null);
  const {pokemonName} = useParams();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const item = await data.json();
        setPokemon(item);
      } catch (e) {
        setError(e);
      }
    }

    fetchData();
  }, [pokemonName]);

  console.log(pokemon);

  if (error !== null) {
    if (error instanceof SyntaxError) {
      return <NotFoundError/>;
    } else {
      return <h1>Error loading the page, check your internet connection, or refresh.</h1>;
    }
  }

  if (pokemon === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={"pokemon-container"}>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name}/>
      <ul>
        <li>HP : {pokemon.stats[0].base_stat}</li>
        <li>Attack : {pokemon.stats[1].base_stat}</li>
        <li>Defense : {pokemon.stats[2].base_stat}</li>
        <li>Special Attack : {pokemon.stats[3].base_stat}</li>
        <li>Special Defense : {pokemon.stats[4].base_stat}</li>
        <li>Speed : {pokemon.stats[5].base_stat}</li>
      </ul>
    </div>
  );

}

export default PokemonDetails;