import React, { useRef, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [movies, setMovies] = useState([]);
  const[loading, setIsLoading] = useState(false);
  const[error, setError] = useState(null);
  const abortController = useRef(null);
  async function fetchmoviesHandler (){
    
    setIsLoading(true);
    setError(null);
    try{
      abortController.current = new AbortController();
      const response = await fetch('https://swapi.dev/api/films', {
        signal: abortController.current.signal
      })
      if(!response.ok){
        setInterval(()=>{
            try{
              response();
            }catch(error){
                console.log("error");
            }
        },5000);
        throw new Error('something went wrong ...RETRYING');
       
      }
      const data = await response.json();
       const transformedMovies = data.results.map(movieData=>{
           return{
             id: movieData.episode_id,
             title: movieData.title,
             openingText: movieData.opening_crawl,
             releaseDate: movieData.release_date
           }
       });
       setMovies(transformedMovies);
      
      } catch(error){
        setError(error.message);
      }
      setIsLoading(false);
      console.log("working");
    
   
  }
  const cancel =()=>{
    abortController.current && abortController.current.abort();
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!loading && movies.length>0 && <MoviesList movies={movies} />}
        {!loading && movies.length === 0 && !error &&<p> Found no movies</p>}
        {!loading && error && <div><p>{error}</p> </div>}
        {loading && <div><LoadingSpinner></LoadingSpinner>  <br/><button onClick={cancel}>cancel</button></div>}
      </section>
    </React.Fragment>
  );
}

export default App;
