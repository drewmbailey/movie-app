import { useTrendingWithRatings } from "../hooks/useTrendingWithRatings";
import MovieCard from "./MovieCard";

const TrendingMovies = () => {
  const { data, loading, error } = useTrendingWithRatings();

  if (loading) return <p className="p-4">Loading trending…</p>;
  if (error) return <p className="p-4 text-red-600">{error.message}</p>;
  if (!data?.length) return <p className="p-4">No movies.</p>;

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((movie) => (
        <MovieCard key={movie.tmdb.id} movie={movie} />
      ))}
    </div>
  );
};

export default TrendingMovies;
