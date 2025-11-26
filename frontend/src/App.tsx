import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}