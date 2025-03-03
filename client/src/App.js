import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<div>Food Category Page</div>} />
        <Route path="/cart" element={<div>Shopping Cart Page</div>} />
        <Route path="/profile" element={<div>User Profile Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/signup" element={<div>Sign Up Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
