import TrendingMovies from "../components/TrendingMovies";

const Home = () => (
  <main className="flex flex-col items-center w-full">
    <div className="p-4 max-w-[1200px]">
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>
      <TrendingMovies />
    </div>
  </main>
);

export default Home;
