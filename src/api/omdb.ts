const OMDB_BASE = "https://www.omdbapi.com/";
const OMDB_KEY = import.meta.env.VITE_OMDB_KEY as string;

export interface OmdbRating { Source: string; Value: string }
export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  imdbID: string;
  imdbRating?: string;
  Ratings?: OmdbRating[];
  BoxOffice?: string;
  Response: "True" | "False";
  Error?: string;
}

export const fetchOmdbByImdbId = async (imdbId: string): Promise<OmdbMovie | null> => {
  const url = `${OMDB_BASE}?apikey=${OMDB_KEY}&i=${encodeURIComponent(imdbId)}&plot=short`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OMDb failed: ${res.status}`);
  const json = (await res.json()) as OmdbMovie;
  return json.Response === "True" ? json : null;
};
