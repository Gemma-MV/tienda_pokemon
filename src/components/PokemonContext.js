// Aqui hacemos la importacion de React, del creador de contenido y de useState, el manejador de estado
import React, { createContext, useState, useEffect } from 'react';

// Aqui creamos el contexto con createContext, lo metemos en la constante PokemonContext (el contesto de los pokemon) y lo exportamos
export const PokemonContext = createContext();

// Función para generar precios aleatorios 
const generateRandomPrice = () => { 
    const minPrice = 10; // Precio mínimo 
    const maxPrice = 1000; // Precio máximo 
    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
};

// Aqui exportamos la funcion PokemonProvider (proveedor de pokemon) que actua como un componente que provee el contexto a sus hijos. El componente PokemonProvider recibe children como una prop. children representa todos los componentes hijos que estarán envueltos por PokemonProvider
export const PokemonProvider = ({ children }) => {
    // Aqui creamos una variable de estado pokemonData y una función para actualizarla setPokemonData e inicializamos el estado pokemonData como un array vacío useState([]).
    const [pokemonData, setPokemonData] = useState([]);
    // Aqui creamos una variable de estado allPokemons y una función para actualizarla setAllPokemons e inicializamos el estado allPokemons como un array vacío.
    const [allPokemons, setAllPokemons] = useState([]);
    const [pokemonPrices, setPokemonPrices] = useState({});
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Esta api contiene 20 pokemon
        fetch(`https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20`)
          .then((res) => res.json())
          .then((data) => {
            // Aqui mapeamos los resultados para extraer solo los nombres de los Pokémons.
            const pokemons = data.results.map(pokemon => pokemon.name);
            // Y actualizamos la lista de todos los Pokémons con los nombres obtenidos.
            setAllPokemons(pokemons);
            // Obtener datos para todos los Pokémon 
            const fetches = data.results.map(pokemon => 
                fetch(pokemon.url).then(res => res.json()) 
            ); 
            Promise.all(fetches).then(pokemonData => { 
                setPokemonData(pokemonData);
            const prices = {}; 
            pokemonData.forEach(pokemon => { 
              prices[pokemon.name.toLowerCase()] = generateRandomPrice(); 
            }); 
            setPokemonPrices(prices); 
            });
          });
        }, []);

        // Función para agregar Pokémon al carrito 
        const addToCart = (pokemon) => { 
            setCart(prevCart => { 
                const newCart = { ...prevCart }; 
                if (newCart[pokemon.name.toLowerCase()]) { 
                    newCart[pokemon.name.toLowerCase()] += 1; 
                } else { 
                    newCart[pokemon.name.toLowerCase()] = 1; 
                } return newCart;
            });
        };

        // Función para eliminar Pokémon del carrito 
        const removeFromCart = (pokemon) => { 
            setCart(prevCart => { 
                const newCart = { ...prevCart }; 
                if (newCart[pokemon.name.toLowerCase()]) { 
                    newCart[pokemon.name.toLowerCase()] -= 1; 
                    if (newCart[pokemon.name.toLowerCase()] === 0) { 
                        delete newCart[pokemon.name.toLowerCase()]; 
                    } 
                } 
                return newCart;
            });
        };

        // Función para calcular el precio total del carrito 
        const calculateTotalPrice = () => { 
            return Object.keys(cart).reduce((total, pokemonName) => { 
                return total + (pokemonPrices[pokemonName] * cart[pokemonName]); 
            }, 0);
        }
        
    // Comienzamos la estructura de retorno del componente.
    return (
        // Aqui pasamos un objeto con los valores y funciones de actualización del estado para que estén disponibles en el contexto. El proveedor de contexto de pokemon (PokemonContext.Provider) tiene como valores las variables selectedPokemon (seleccionar pokemon), pokemonData y allPokemons y las funciones de devolucion de datos setSelectedPokemon, setPokemonData y setAllPokemons. Y dentro le pasamos los componentes hijos que estan envueltos dentro del creador de contextos
        <PokemonContext.Provider value={{ pokemonData, allPokemons,  pokemonPrices, cart, addToCart, removeFromCart, calculateTotalPrice }}>
            {children}
        </PokemonContext.Provider>
    );
};