// // Aqui importamos los hooks useEffect para que podamos realizar efectos secundarios en componentes funcionales y useContext que te permite suscribirte a un contexto de React
// import { useEffect, useContext } from 'react';
// // Aqui importamos el componente PokemonContext. En este caso lo hacemos como importacion nombrada.
// import { PokemonContext } from './PokemonContext';

// // Aqui definimos una función de flecha llamada useFetch. Este es un hook personalizado que utilizaremos para obtener datos de Pokémon
// const useFetch = () => {
//     // Aqui metemos en la constante con destructurin selectedPokemon y setPokemonData, en las que selectedPokemon es el pokemon actualmente seleccionado y setPokemonData es una función que se usará para actualizar los datos del Pokémon y usamos el contexto que hemos creado en el componente PokemonContext
//     const { selectedPokemon, setPokemonData } = useContext(PokemonContext);

//     // Aqui usamos useEffect para hacer una solicitud HTTP a una API para obtener datos de un Pokémon específico y que se ejecute después de que el componente se ha renderizado, esto es útil porque queremos hacer la solicitud a la API después de que el componente se haya montado en el DOM. No podemos hacer esta solicitud directamente en el cuerpo del componente porque necesitamos que React complete la renderización inicial antes de ejecutar código adicional. En nuestro caso, el efecto se ejecuta cada vez que selectedPokemon cambia. Esto asegura que cada vez que se selecciona un nuevo Pokémon, se haga una nueva solicitud a la API para obtener los datos del nuevo Pokémon seleccionado. No usamos useState porque este se utiliza para manejar y mantener el estado de un componente, pero no puede ejecutar código después de la renderización del componente.
//     useEffect(() => {
//         fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
//             .then((res) => res.json())
//             // Aqui actualizamos el estado pokemonData con los datos del Pokémon obtenidos, setPokemonData([data]) guarda los datos en un array.
//             .then((data) => setPokemonData([data]));
//     // El array de dependencias [selectedPokemon, setPokemonData] asegura que el efecto se ejecute cada vez que selectedPokemon o setPokemonData cambien. Esto significa que cada vez que se seleccione un nuevo Pokémon, se hará una nueva solicitud para obtener sus datos.
//     }, [selectedPokemon, setPokemonData]);
// };

// export default useFetch;