import { useMemo } from "react";
import { useTrendingWithRatings } from "../hooks/useTrendingWithRatings";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Legend,
  Cell,
} from "recharts";

// Parse box office "$123,456,789" into number
const parseUsd = (s?: string | null) => {
  if (!s) return 0;
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

// Tailwind-inspired, high-contrast palette
const PALETTE = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#14b8a6",
  "#0ea5e9",
];
const colorAt = (i: number) => PALETTE[i % PALETTE.length];

// Color scale for scatter by IMDb rating (0–10)
const scatterColor = (imdb: number) => {
  const idx = Math.max(0, Math.min(PALETTE.length - 1, Math.round((imdb / 10) * (PALETTE.length - 1))));
  return colorAt(idx);
};

const Charts = () => {
  const { data, loading, error } = useTrendingWithRatings();

  const { topRatings, topBoxOffice } = useMemo(() => {
    const items = data ?? [];

    // Top 10 by rating 
    const rated = items.map(i => {
      const imdbRaw = i.omdb?.imdbRating;
      const imdb = imdbRaw != null && imdbRaw !== "" ? Number(imdbRaw) : NaN;
      const tmdb = typeof i.tmdb.vote_average === "number" ? i.tmdb.vote_average : NaN;

      // choose first valid (>0) rating: IMDb >0 else TMDb >0; otherwise null (exclude)
      const hasImdb = !Number.isNaN(imdb) && imdb > 0;
      const hasTmdb = !Number.isNaN(tmdb) && tmdb > 0;

      const rating = hasImdb ? imdb : (hasTmdb ? tmdb : null);
      const source = hasImdb ? "IMDb" : (hasTmdb ? "TMDb" : null);

      return {
        title: i.tmdb.title ?? i.tmdb.name ?? "Untitled",
        rating, // number | null
        source, // "IMDb" | "TMDb" | null
      };
    })
    // keep ONLY rated titles
    .filter(r => r.rating !== null) as { title: string; rating: number; source: "IMDb" | "TMDb" }[];

    
    const topRatings = rated
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    // Top 10 by OMDb BoxOffice
    const topBoxOffice = items
      .map(i => ({
        title: i.tmdb.title ?? i.tmdb.name ?? "Untitled",
        box: parseUsd(i.omdb?.BoxOffice),
      }))
      .filter(r => r.box > 0)
      .sort((a, b) => b.box - a.box)
      .slice(0, 10);

    return { topRatings, topBoxOffice };
  }, [data]);

  if (loading) return <p className="p-4">Loading charts…</p>;
  if (error)
    return (
      <div className="p-4">
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Couldn’t load data</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap">{error.message}</pre>
        </div>
      </div>
    );
  if (!data?.length) return <p className="p-4">No data for charts.</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Top 10 Box Office */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <h2 className="font-semibold mb-2">Top 10 Box Office (OMDb)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topBoxOffice}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              tickLine={true}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={150}
              style={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
              width={80}
              style={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
            <Legend />
            <Bar 
              name="Gross" 
              dataKey="box"
              barSize={20}
            >
              {topBoxOffice.map((_, i) => (
                <Cell 
                  key={i} 
                  fill={colorAt(i)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 Movies by Rating */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <h2 className="font-semibold mb-2">Top 10 Movies by Rating</h2>
        <p className="text-xs text-gray-600 mb-2">
          (Based on <span className="font-medium">IMDb</span> rating when available, otherwise falls back to <span className="font-medium">TMDb</span>.)
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topRatings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              tickLine={true}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={150}
              style={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 10]} 
              width={50} 
              style={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v: any, _n: string, entry: any) => [`${Number(v).toFixed(1)}`, `Rating (${entry.payload.source})`]} />
            <Legend />
            <Bar 
              name="Rating" 
              dataKey="rating"
              barSize={20}
            >
              {topRatings.map((_, i) => (
                <Cell 
                  key={i} 
                  fill={colorAt(i)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
