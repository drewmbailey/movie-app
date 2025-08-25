import { useEffect, useState } from "react";
import { fetchTrendingMovies, fetchExternalIds, fetchTmdbReviews, TmdbMovie, TmdbReview } from "../api/tmdb";
import { fetchOmdbByImdbId, OmdbMovie } from "../api/omdb";

const pLimit = (concurrency: number) => {
  const queue: Array<() => Promise<void>> = [];
  let active = 0;
  const next = () => {
    active--;
    if (queue.length) queue.shift()!();
  };
  return <T,>(fn: () => Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      const run = async () => {
        active++;
        try { resolve(await fn()); }
        catch (e) { reject(e); }
        finally { next(); }
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
};

export interface TrendingItem {
  tmdb: TmdbMovie;
  imdbId: string | null;
  omdb: OmdbMovie | null;
  tmdbReviews: TmdbReview[];
}

export const useTrendingWithRatings = () => {
  const [data, setData] = useState<TrendingItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<Error | null>(null);

  useEffect(() => {
    const limit = pLimit(4);

    (async () => {
      try {
        setLoading(true);
        const trending = await fetchTrendingMovies();

        const enriched = await Promise.all(
          trending.map(movie =>
            limit(async () => {
              const ext = await fetchExternalIds(movie.id);
              const imdbId = ext.imdb_id;
              const [omdb, tmdbReviews] = await Promise.all([
                imdbId ? fetchOmdbByImdbId(imdbId) : Promise.resolve(null),
                fetchTmdbReviews(movie.id),
              ]);
              return { tmdb: movie, imdbId, omdb, tmdbReviews };
            })
          )
        );

        setData(enriched);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
};
