import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const yourkey = "4a665641";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // check if the movie is already in the watched list
  function handleSelectMovie(imdbID) {
    setSelectedId((selectedId) => (imdbID === selectedId ? null : imdbID));
  }

  // close the movie details
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // add a movie to the watched list
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // delete a movie from the watched list
  function handleDeleteWatchedMovie(imdbID) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== imdbID));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${yourkey}&s=${query}`,
            { signal: controller.signal }
          );

          if (!response.ok) throw new Error("Failed to fetch movies");

          const data = await response.json();
          if (data.response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );

  function Loader() {
    return (
      <div className="loader">
        <p>Loading...</p>
      </div>
    );
  }

  function ErrorMessage({ message }) {
    return (
      <p className="error">
        <span>⛔️</span> {message}
      </p>
    );
  }
  function NavBar({ children }) {
    return (
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    );
  }

  function Logo() {
    return (
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    );
  }

  function Search({ query, setQuery }) {
    return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    );
  }

  function NumResults({ movies }) {
    return (
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    );
  }

  function Main({ children }) {
    return <main className="main">{children}</main>;
  }

  function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>
    );
  }

  function MovieList({ movies, onSelectedMovie }) {
    return (
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie
            key={movie.imdbID}
            movie={movie}
            onSelectedMovie={onSelectedMovie}
          />
        ))}
      </ul>
    );
  }

  function Movie({ movie, onSelectedMovie }) {
    return (
      <li onClick={() => onSelectedMovie(movie.imdbID)} key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    );
  }

  function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatchedMovie,
    watched,
  }) {
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    const watchedMovieRating = watched.find(
      (movie) => movie.imdbID === selectedId
    )?.userRating;

    const {
      Title: title,
      Year: year,
      Poster: poster,
      Runtime: runtime,
      imdbRating,
      Plot: plot,
      Released: released,
      Actors: actors,
      Director: director,
      Genre: genre,
    } = movie;

    function handleAdd() {
      const newMovie = {
        imdbID: selectedId,
        title,
        year,
        poster,
        runtime: Number(runtime.split(" ").at(0)),
        imdbRating: Number(imdbRating),
        userRating,
      };
      onAddWatchedMovie(newMovie);
      handleCloseMovie();
    }

    useEffect(
      function () {
        function callback(e) {
          if (e.code === "Escape") {
            handleCloseMovie();
            console.log("Escape key pressed");
          }
        }
        document.addEventListener("keydown", callback);
        return function () {
          document.removeEventListener("keydown", callback);
        };
      },
      [onCloseMovie]
    );

    useEffect(
      function () {
        async function getMovieDetails() {
          setLoading(true);
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${yourkey}&i=${selectedId}`
          );
          const data = await response.json();
          setMovie(data);
          setLoading(false);
        }
        getMovieDetails();
      },
      [selectedId]
    );

    useEffect(
      function () {
        if (!title) return;
        document.title = `${title} - usePopcorn`;

        return function () {
          document.title = "usePopcorn";
        };
      },
      [title]
    );

    return (
      <div className="details">
        {loading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!iswatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated with movie{watchedMovieRating}
                    <span>⭐️</span>
                  </p>
                )}
              </div>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    );
  }

  function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    );
  }

  function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovies
            key={movie.imdbID}
            movie={movie}
            onDeleteWatched={onDeleteWatched}
          />
        ))}
      </ul>
    );
  }
}

function WatchedMovies({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => {
            onDeleteWatched(movie.imdbID);
          }}
        >
          X
        </button>
      </div>
    </li>
  );
}
