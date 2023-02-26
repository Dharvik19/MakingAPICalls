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
      const response = await fetch("https://reactapi-f0721-default-rtdb.firebaseio.com/movies.json", {
        signal: abortController.current.signal,
      });
      if (!response.ok) {
        throw new Error("something went wrong ...RETRYING");
      }
      const data = await response.json();
      const loadedMovies =[];
      for(const key in data){
        loadedMovies.push({
          id:key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate : data[key].releaseDate
        })
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
    console.log("working");
  },[]);
  useEffect(() => {
    fetchmoviesHandler();
  }, [fetchmoviesHandler]);

  async function onAddMovieHandler(movie){
    const response = await fetch("https://reactapi-f0721-default-rtdb.firebaseio.com/movies.json", {
      method:"POST",
      body:JSON.stringify(movie),
      headers:{
        'Content-Type': 'application/json'
      }
    });
      const data = await response.json();
      console.log(data);
  }

  const cancel = () => {
    abortController.current && abortController.current.abort();
  };

  const deleteMovieHandler = async (id) => {
   console.log("delete")
    await fetch(
      `https://my-react-fetch-default-rtdb.firebaseio.com/movies/${id}`,
      {
        method: "DELETE",
        body: JSON.stringify(movies),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
  };
  return (
    <React.Fragment>
      <section>
        <AddMovies onAddMovie={onAddMovieHandler}></AddMovies>
      </section>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!loading && movies.length > 0 && <MoviesList onClick={deleteMovieHandler} movies={movies} />}
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
