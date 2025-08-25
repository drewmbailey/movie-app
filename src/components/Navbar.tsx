import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="p-4 bg-gray-800 text-white flex gap-4">
    <Link to="/" className="hover:underline">Trending Movies
</Link>
    <Link to="/insights" className="hover:underline">Insights</Link>
  </nav>
);

export default Navbar;
