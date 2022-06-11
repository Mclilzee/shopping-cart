import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import Store from "./components/Storepage/Store";
import PokemonDetails from "./components/PokemonDetails/PokemonDetails";
import Cart from "./components/Cart/Cart";
import Alert from "./components/Alert/Alert";
import { Routes, Route } from "react-router-dom";
import { capitalize } from "./helperFunctions";

function App() {

  const [cartContent, setCartContent] = React.useState(() => {
    return JSON.parse(localStorage.getItem("pokemons")) || {};
  });
  const [alert, setAlert] = React.useState({});
  const [displayAlert, setDisplayAlert] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("pokemons", JSON.stringify(cartContent));
  }, [cartContent]);

  React.useEffect(() => {
    setDisplayAlert(true);
    setTimeout(() => setDisplayAlert(false), 3000);
  }, [alert]);

  function addPokemonToCart(pokemonName, amount) {
    if (amount > 10) {
      amount = 10;
    }

    setCartContent(prevState => {
      if (prevState[pokemonName] !== undefined) {
        return adjustPokemonAmount(prevState, pokemonName, amount);
      } else {
        setSuccessfulAlert(capitalize(pokemonName), amount);
        return {...prevState, [pokemonName]: {name: pokemonName, amount}};
      }
    });
  }

  function adjustPokemonAmount(prevState, pokemonName, amount) {
    if (prevState[pokemonName].amount >= 10) {
      setErrorAlert();
      return {...prevState};
    }

    let newAmount = prevState[pokemonName].amount + amount;
    if (newAmount > 10) {
      newAmount = 10;
    }
    setSuccessfulAlert(capitalize(pokemonName), newAmount);
    return {...prevState, [pokemonName]: {name: pokemonName, amount: newAmount}};
  }


  function setErrorAlert() {
    setAlert({
      message: "You can only buy 10 of each type of pokemon!",
      completed: false
    });
  }

  function setSuccessfulAlert(pokemonName, amount) {
    setAlert({
      message: `You now have ${amount} of ${pokemonName} in Cart!`,
      completed: true
    });
  }

  return (<div>
    {displayAlert && <Alert message={alert.message} completed={alert.completed}/>}
    <Navbar cartLength={Object.keys(cartContent).length}/>
    <Routes>
      <Route path={"/"} element={<Homepage/>}/>
      <Route path={"/store"} element={<Store handleSubmit={addPokemonToCart}/>}/>
      <Route path={"/pokemon/:pokemonName"} element={<PokemonDetails/>}/>
      <Route path={"/cart"} element={<Cart pokemons={cartContent}/>}/>
    </Routes>
  </div>);
}

export default App;
