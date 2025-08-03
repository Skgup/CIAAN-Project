import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/profile";
import Navbar from "./components/Navbar";
function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={token ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
