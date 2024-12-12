// Aqui hacemos la importacion de React, y las funciones especificas de react del creador de contenido, de useState (para manejar y actualizar estados (valores que pueden cambiar) dentro de un componente) y de useEffect (para ejecutar código en ciertos momentos del ciclo de vida de un componente, como después de que se renderiza)
import React, { createContext, useState, useEffect } from 'react';

// Aqui creamos el contexto con createContext, que permite compartir valores entre componentes y lo metemos en la constante PokemonContext (el contesto de los pokemon) y lo exportamos
export const PokemonContext = createContext();

// Función para generar precios aleatorios que sean de minimo 10 y maximo 1000
const generateRandomPrice = () => { 
    const minPrice = 10; // Precio mínimo 
    const maxPrice = 1000; // Precio máximo 
    // Aqui calculamos de manera aleatoria un numero con Math.random y lo multiplicamos por el numero de la resta de maxPrice menos minPrice (990), de esta manera el numero random nunca va a ser mayor de 1000 ni menor de 10 y como Math.random puede generar un numero decimal lo redondeamos con Math.floor
    return Math.floor(Math.random() * (maxPrice - minPrice));
};

// Aqui exportamos la funcion PokemonProvider (proveedor de pokemon) que actua como un componente que provee el contexto a sus hijos. El componente PokemonProvider recibe children como una prop. children representa todos los componentes hijos que estarán envueltos por PokemonProvider
export const PokemonProvider = ({ children }) => {
    // Aqui creamos una variable de estado pokemonData y una función para actualizarla setPokemonData e inicializamos el estado pokemonData como un array vacío useState([]), de esta manera al principio no contendra ningun valor pero sera una variable que se espera que cambie con el tiempo.
    const [pokemonData, setPokemonData] = useState([]);
    // Aqui creamos una variable de estado allPokemons y una función para actualizarla setAllPokemons e inicializamos el estado allPokemons como un array vacío.
    const [allPokemons, setAllPokemons] = useState([]);
    const [pokemonPrices, setPokemonPrices] = useState({});
    const [cart, setCart] = useState([]);

    // Metemos la api dentro de useEffect porque queremos que la pinte de manera asincrona despues de que haya recibido los datos de la api
    useEffect(() => {
        // Esta api contiene 20 pokemon
        fetch(`https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20`)
          .then((res) => res.json())
          .then((data) => {
            // Aqui mapeamos los resultados para extraer solo los nombres de los Pokémons.
            const pokemons = data.results.map(pokemon => pokemon.name);
            // Y actualizamos la lista de todos los Pokémons con los nombres obtenidos.
            setAllPokemons(pokemons);
            // Aqui recorremos nuevamente el data que contiene el resultado de los pokemon
            const fetches = data.results.map(pokemon => 
                // Y hacemos una solicitud a la URL específica de cada Pokémon, convertimos la respuesta de cada solicitud en un objeto JSON y lo almacenamos en la const fetches
                fetch(pokemon.url).then(res => res.json()) 
            ); 
            // Promise.all espera a que todas las promesas en el array fetches se completen, las ejecuta cuando se han resuelto y llama a la funcion setPokemonData que actualiza los datos de pokemonData
            Promise.all(fetches).then(pokemonData => { 
                setPokemonData(pokemonData);
            // Creamos la constante que contendra los datos de los pokemon
            const prices = {}; 
            // Recorremos los datos de pokemonData
            pokemonData.forEach(pokemon => { 
                // A la constante prices segun la posicion del nombre del pokemon llamammos a la funcion generateRandomPrice que le da un precio aleatorio
                prices[pokemon.name.toLowerCase()] = generateRandomPrice(); 
            }); 
            // Actualizamos el precio del pokemon llamando a la funcion setPokemonPrices
            setPokemonPrices(prices); 
            });
          });
        // El [] es un array vacio que provoca que el código dentro de useEffect se ejecute solo una vez, cuando el componente se monte por primera vez.  
        }, []);

        // Función para agregar Pokémon al carrito 
        const addToCart = (pokemon) => { 
            // setCart actualiza el estado del carrito empezando por el estado actual del carrito prevCart
            setCart(prevCart => { 
                // Creamos una nueva copia del carrito actual guardandola en newCart utilizando el operador de propagación (...) para copiar todas las propiedades del objeto prevCart en un nuevo objeto newCart 
                const newCart = { ...prevCart }; 
                // Aqui comprobamos si ya hay un pokemon en el carrito que se mete con la llamada a cart en DivStore dentro del div Cart
                if (newCart[pokemon.name.toLowerCase()]) { 
                    // Si hay un pokemon incrementamos su cantidad en 1 cuando volvemos a seleccionar otro
                    newCart[pokemon.name.toLowerCase()] += 1; 
                } else { 
                    // Sino deja la cantidad de pokemon en 1
                    newCart[pokemon.name.toLowerCase()] = 1; 
                } 
                return newCart;
            });
        };

        // Función para eliminar Pokémon del carrito, creamos la constante que contiene la funcion y actualizamos el carrito con setCart con el estado actual del carrito prevCart
        const removeFromCart = (pokemon) => { 
            setCart(prevCart => { 
                // Creamos la copia del carrito actual
                const newCart = { ...prevCart }; 
                // Si hay un pokemon en el carrito le quitamos 1
                if (newCart[pokemon.name.toLowerCase()]) { 
                    newCart[pokemon.name.toLowerCase()] -= 1; 
                    // Verifica si la cantidad de pokemon en el carrito ha llegado a 0
                    if (newCart[pokemon.name.toLowerCase()] === 0) { 
                        // Si la cantidad del Pokémon es 0, lo elimina del carrito
                        delete newCart[pokemon.name.toLowerCase()]; 
                    } 
                } 
                return newCart;
            });
        };

        // Función para calcular el precio total del carrito 
        const calculateTotalPrice = () => { 
            // Object.keys es una función que devuelve un array con las claves del objeto cart que contiene los pokemon añadidos al carrito en DivStore. En este caso, devuelve un array con los nombres de los Pokémons en el carrito los reducimos con reduce a un solo valor, total es el acumulador que mantiene la suma total mientras se recorre el array y pokemonName es el nombre del Pokémon actual que se está procesando en el array
            return Object.keys(cart).reduce((total, pokemonName) => { 
                // La función reduce devuelve esta expresión en cada iteración, actualizando el acumulador total. pokemonPrices[pokemonName]: accede al precio del Pokémon usando su nombre como clave en el objeto pokemonPrices y cart[pokemonName]: accede a la cantidad del Pokémon en el carrito usando su nombre como clave en el objeto cart. Total suma el precio del pokemon pokemonPrices[pokemonName] por la cantidad de pokemon que hay cart[pokemonName]
                return total + (pokemonPrices[pokemonName] * cart[pokemonName]); 
            // 0 es el valor inicial del acumulador del carrito
            }, 0);
        }
        
    // Comienzamos la estructura de retorno del componente.
    return (
        // Aqui pasamos un objeto con los valores y funciones de actualización del estado para que estén disponibles en el contexto
        <PokemonContext.Provider value={{ pokemonData, allPokemons,  pokemonPrices, cart, addToCart, removeFromCart, calculateTotalPrice }}>
            {children}
        </PokemonContext.Provider>
    );
};