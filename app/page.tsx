"use client";

export default function Home() {

  const users = async () => {
    const datos = await fetch('https://api-java-puerto.onrender.com/api/user');
    console.log("datos ", datos);
  };

  const pokemons = async () => {
    const datos = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    console.log("datos ", datos);
  };

  return (
    <div>
      <h1>Hola Aqui comienza la pagina de web de Puerto Liverpool</h1>
      <button onClick={users}>
        Get Data 1
      </button>
      <button onClick={pokemons}>
        Get Data 2
      </button>
    </div>
  );
}