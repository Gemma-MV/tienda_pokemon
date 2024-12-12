import React, { useContext } from 'react';
import { PokemonProvider, PokemonContext } from './PokemonContext';
import carrito from "../assets/img/carrito.png";
import borrar from "../assets/img/borrar.png"
// import useFetch from './UseFetch';

// Aqui creamos una funcion llamada PokemonStore para manejar la tienda de pokemons
const PokemonStore = () => {
    // Aqui le damos con destructirin a los valores usados en el contexto PokemonContext la funcion , son los datos que vamos a necesitar para poder ejecutar el codigo de mas abajo
    const {pokemonData, pokemonPrices, cart, addToCart, removeFromCart, calculateTotalPrice } = useContext(PokemonContext);

return ( 
  <div className="Main"> 
    <img src={carrito} className="carrito"></img>
    <div className='divContainer'>
      {/* Aqui verificamos si pokemonData existe y si no esta vacio, lo recorremos con map y lo iteramos */}
      {/* En el key cogemos la iteracion*/}
      {pokemonData && pokemonData.map((pokemon, i) => ( 
        <div key={i} className='divPokemon'> 
          <h2>{pokemon.name.toUpperCase()}</h2> 
          <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} /> 
          <p>Precio: ${pokemonPrices[pokemon.name.toLowerCase()] || 'No disponible'}</p> <button onClick={() => addToCart(pokemon)}>Comprar</button> 
        </div>
    ))} 
    </div>
        {/* Mostrar el contenido del carrito */} 
      <div className="Cart"> 
        <h2>Carrito de Compras</h2> 
        <p className='nCart'>{Object.values(cart).reduce((total, quantity) => total + quantity, 0)}</p>
        <div className='Cart-gray'>
          {Object.keys(cart).length === 0 ? ( 
            <p>El carrito está vacío.</p> 
          ) : ( 
            <ul> 
              {Object.keys(cart).map((pokemonName, index) => ( 
                <li key={index} className='Cart--flex'> 
                  <button className="Cartis-delete" onClick={() => removeFromCart(pokemonData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase()))}><img src={borrar}></img></button>
                  {cart[pokemonName]} x {pokemonName.toUpperCase()} - ${pokemonPrices[pokemonName.toLowerCase()]} 
                </li> 
              ))} 
            </ul>
        )}
        {/* Mostrar el precio total del carrito */} 
        <div className='Cart-blue'>
          <h3>Total de Compra:</h3>
          <p>{calculateTotalPrice()} €</p>
        </div>
        </div>
      </div>
  </div>
  );
};

function DivStore() {
  return (
    <PokemonProvider>
      <PokemonStore />
    </PokemonProvider>
  );
}

export default DivStore;