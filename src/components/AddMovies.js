import React,{useRef} from "react";
import classes from "./AddMovies.module.css";

const AddMovies = () => {
    const titleRef = useRef('');
    const openingTextRef = useRef('');
    const releaseDateRef = useRef('');

    const onSubmitHandler=(event)=>{
        event.preventDefault();
        const movie = {
            title: titleRef.current.value,
            openingText: openingTextRef.current.value,
            releaseDate: releaseDateRef.current.value,
        }
        console.log(movie);
    }
  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="title">Title</label>
          <input id="title" ref={titleRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="opening-text">Opening Text</label>
          <textarea rows="5" id="opening-text" ref={openingTextRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="date">Release Date</label>
          <input id="date" ref={releaseDateRef} required />
        </div>
        <button>Add Movie</button>
      </form>
    </>
  );
};

export default AddMovies;
