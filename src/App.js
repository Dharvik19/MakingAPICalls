import React, { useCallback, useEffect, useRef, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import AddMovies from "./components/AddMovies";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  const fetchmoviesHandler= useCallback(async()=> {
    setIsLoading(true);
    setError(null);
    try {
      abortController.current = new AbortController();
      const response = await fetch("https://swapi.dev/api/films", {
        signal: abortController.current.signal,
      });
      if (!response.ok) {
        throw new Error("something went wrong ...RETRYING");
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
    console.log("working");
  },[]);
  useEffect(() => {
    fetchmoviesHandler();
  }, [fetchmoviesHandler]);

  const cancel = () => {
    abortController.current && abortController.current.abort();
  };
  return (
    <React.Fragment>
      <section>
        <AddMovies></AddMovies>
      </section>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!loading && movies.length > 0 && <MoviesList movies={movies} />}
        {!loading && movies.length === 0 && !error && <p> Found no movies</p>}
        {!loading && error && (
          <div>
            <p>{error}</p>{" "}
          </div>
        )}
        {loading && (
          <div>
            <LoadingSpinner></LoadingSpinner> <br />
            <button onClick={cancel}>cancel</button>
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
