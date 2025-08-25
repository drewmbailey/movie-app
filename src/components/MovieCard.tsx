import { useState } from "react";
import { TrendingItem } from "../hooks/useTrendingWithRatings";
import OverviewModal from "./OverviewModal";

const img = (path: string | null, size = 342) =>
  path ? `https://image.tmdb.org/t/p/w${size}${path}` : null;

interface MovieCardProps {
  movie: TrendingItem;
}

const MovieCard = ({ movie: { tmdb, imdbId, omdb, tmdbReviews } }: MovieCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const poster = img(tmdb.poster_path);
  const title = tmdb.title ?? tmdb.name ?? "Untitled";

  return (<>
    <article className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {poster && <img src={poster} alt={`${title} poster`} className="w-full aspect-[2/3] object-cover" />}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <div className="relative">
          <p className="text-sm text-gray-600 line-clamp-3">{tmdb.overview}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            Read more...
          </button>
        </div>
        <div className="mt-3 text-sm">
          <div>TMDb score: <span className="font-medium">{tmdb.vote_average.toFixed(1)}</span></div>
          {omdb?.imdbRating && (
            <div>IMDb rating: <span className="font-medium">{omdb.imdbRating}</span></div>
          )}
          {omdb?.BoxOffice && (
            <div>Box office: <span className="font-medium">{omdb.BoxOffice}</span></div>
          )}
        </div>
        <div className="mt-3 flex gap-3 text-sm">
          {imdbId && (
            <a className="underline" href={`https://www.imdb.com/title/${imdbId}`} target="_blank" rel="noreferrer">
              IMDb
            </a>
          )}
          <a className="underline" href={`https://www.themoviedb.org/movie/${tmdb.id}`} target="_blank" rel="noreferrer">
            TMDb
          </a>
        </div>
      </div>
    </article>
    <OverviewModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={title}
    >
      <p className="text-gray-600 whitespace-pre-wrap">{tmdb.overview}</p>
    </OverviewModal>
  </>
  );
};

export default MovieCard;
