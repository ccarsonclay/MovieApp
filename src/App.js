import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  const addReview = async (title, rating, review) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=3e71c3e0`);
      const movieData = response.data;
  
      if (movieData.Response === 'True') {
        const imdbID = movieData.imdbID;
        const posterResponse = await axios.get(`http://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=3e71c3e0`);
        const posterData = posterResponse.data;
  
        const newMovie = {
          title,
          rating,
          review,
          poster: posterData.Poster,
        };
  
        setMovies(prevMovies => [...prevMovies, newMovie]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="app">
      <header>
        <h1>MovieBoxxd</h1>
      </header>
      <main>
        {/* Display movie list */}
        <section id="movies">
          <h2>Top Movies</h2>
          <div className="movie-list">
            {movies.map((movie, index) => (
              <div key={index} className="movie-card">
              <h3>{movie.title}</h3>
              <img src={movie.poster} alt={movie.title} />
              <p>{movie.review}</p>
              <p>Rating: {movie.rating}</p>
            </div>
            ))}
          </div>
        </section>

        {/* Review form */}
        <section id="add-review-form">
          <h2>Add a Review</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { title, rating, review } = e.target;
              addReview(title.value, Number(rating.value), review.value);
              e.target.reset();
            }}
          >
            <label htmlFor="movie-title">Movie Title:</label>
            <input type="text" id="movie-title" required />

            <label htmlFor="rating">Rating:</label>
            <input type="number" id="rating" min="0" max="5" step="0.1" required />

            <label htmlFor="review">Review:</label>
            <textarea id="review" />
            
            <button type="submit">Submit Review</button>
          </form>
        </section>
      </main>
      <footer>
        &copy; 2023 Movie Reviews
      </footer>
    </div>
  );
}

export default App;