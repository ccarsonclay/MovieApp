import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [score, setScore] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?s=${encodeURIComponent(
          searchTerm
        )}&apikey=3e71c3e0`
      );
      const data = response.data;

      if (data.Response === 'True') {
        const moviesWithPosters = await Promise.all(
          data.Search.map(async (movie) => {
            const posterResponse = await axios.get(
              `http://www.omdbapi.com/?i=${encodeURIComponent(
                movie.imdbID
              )}&apikey=3e71c3e0`
            );
            const posterData = posterResponse.data;

            return {
              id: movie.imdbID,
              title: movie.Title,
              poster: posterData.Poster,
            };
          })
        );

        setMovies(moviesWithPosters);
        setError('');
      } else {
        setMovies([]);
        setError(data.Error);
      }
    } catch (error) {
      console.error(error);
      setMovies([]);
      setError('An error occurred while fetching the movies');
    }
  };

  const handleReviewSubmit = (e, movieId, reviewContent) => {
    e.preventDefault();

    const newReview = {
      movieId: movieId,
      content: reviewContent,
      score: score,
    };

    setReviews([...reviews, newReview]);
    setReviewContent('');
    setScore('');
  };

  return (
    <div className="container">
      <h1>Movie Review App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          required
        />
        <button type="submit">Search</button>
      </form>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="movies">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster} alt={movie.title} />
              <h2>{movie.title}</h2>

              <form onSubmit={(e) => handleReviewSubmit(e, movie.id, reviewContent)}>
                <input
                  type="text"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Write a review..."
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Score (1-10)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
                <button type="submit">Submit Review</button>
              </form>

              <div className="reviews">
                {reviews.map((review, index) => {
                  if (review.movieId === movie.id) {
                    return (
                      <div key={index}>
                        <p>{review.content}</p>
                        <p>Score: {review.score}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;