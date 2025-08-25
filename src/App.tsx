import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import About from "./pages/About";
import Navbar from "./components/Navbar";

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </div>
  </Router>
);

export default App;
