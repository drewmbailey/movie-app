const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY as string;

export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
}

export interface TmdbTrendingResponse {
  results: TmdbMovie[];
}

export const fetchTrendingMovies = async (): Promise<TmdbMovie[]> => {
  const url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb trending failed: ${res.status}`);
  const json = (await res.json()) as TmdbTrendingResponse;
  return json.results;
};

export interface ExternalIds { imdb_id: string | null }
export const fetchExternalIds = async (tmdbId: number): Promise<ExternalIds> => {
  const url = `${TMDB_BASE}/movie/${tmdbId}/external_ids?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb external_ids failed: ${res.status}`);
  return (await res.json()) as ExternalIds;
};

export interface TmdbReview {
  id: string;
  author: string;
  content: string;
  url: string;
}
export interface TmdbReviewsResponse { results: TmdbReview[] }
export const fetchTmdbReviews = async (tmdbId: number): Promise<TmdbReview[]> => {
  const url = `${TMDB_BASE}/movie/${tmdbId}/reviews?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb reviews failed: ${res.status}`);
  const json = (await res.json()) as TmdbReviewsResponse;
  return json.results;
};
