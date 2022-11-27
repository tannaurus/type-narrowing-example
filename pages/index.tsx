import { useState } from "react";

import styles from "../styles/Home.module.css";

interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
}

interface Loading {
  type: "loading";
}

interface Error {
  type: "error";
  message: string;
}

interface WaitingForEntry {
  type: "waitingForEntry";
  pokemonName: string;
}

interface CaughtPokemon extends Omit<WaitingForEntry, "type"> {
  type: "caughtPokemon";
  caughtPokemon: Pokemon;
}

type HomeState = Loading | Error | WaitingForEntry | CaughtPokemon;

export default function Home() {
  const [state, setState] = useState<HomeState>({
    type: "loading",
  });
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [pokemonName, setPokemonName] = useState<string>("");
  // const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  // const getPokemon = async () => {
  //   setLoading(true);
  //   setPokemon(null);
  //   try {
  //     const response = await fetch(
  //       `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  //     );
  //     const enc = new TextDecoder();
  //     const decodedPokemon = JSON.parse(
  //       enc.decode(await response.arrayBuffer())
  //     ) as unknown as Pokemon;
  //     // validated
  //     console.log(decodedPokemon);
  //     setPokemon(decodedPokemon);
  //     setError("");
  //   } catch {
  //     setError("Failed to catch pokemon");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getPokemon = async (validState: WaitingForEntry | CaughtPokemon) => {
    setState({ type: "loading" });
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${validState.pokemonName}`
      );
      const enc = new TextDecoder();
      const decodedPokemon = JSON.parse(
        enc.decode(await response.arrayBuffer())
      ) as unknown as Pokemon;
      // validated
      console.log(decodedPokemon);
      setState({
        type: "caughtPokemon",
        pokemonName: "",
        caughtPokemon: decodedPokemon,
      });
    } catch {
      setState({
        type: "error",
        message: "Failed to catch pokemon",
      });
    }
  };

  const PokemonInputs = (props: {
    validState: WaitingForEntry | CaughtPokemon;
  }) => {
    return (
      <>
        <input
          onChange={(e) =>
            setState({
              type: "waitingForEntry",
              pokemonName: e.target.value,
            })
          }
        />
        <input type="submit" onClick={() => getPokemon(props.validState)} />
      </>
    );
  };

  return (
    <div className={styles.container}>
      {state.type === "loading" && <p>Loading...</p>}
      {state.type === "error" && (
        <>
          <p>{state.message}</p>
          <button
            onClick={() =>
              setState({ type: "waitingForEntry", pokemonName: "" })
            }
          >
            Try again
          </button>
        </>
      )}
      {state.type === "waitingForEntry" && <PokemonInputs validState={state} />}
      {state.type === "caughtPokemon" && (
        <>
          <PokemonInputs validState={state} />
          <p>{state.caughtPokemon.name}</p>
          <p>{state.caughtPokemon.base_experience}</p>
          <p>{state.caughtPokemon.height}</p>
        </>
      )}
      {/* {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <>
          <p>{error}</p>
          <button onClick={() => setError("")}>Try again</button>
        </>
      ) : (
        <>
          <input onChange={(e) => setPokemonName(e.target.value)} />
          <input type="submit" onClick={() => getPokemon()} />
          {pokemon && (
            <>
              <p>{pokemon.name}</p>
              <p>{pokemon.base_experience}</p>
              <p>{pokemon.height}</p>
            </>
          )}
        </>
      )} */}
    </div>
  );
}
