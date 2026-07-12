import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Precificar from "./pages/Precificar";
import Ingredientes from "./pages/Ingredientes";
import Receitas from "./pages/Receitas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/precificar" element={<Precificar />} />
        <Route path="/ingredientes" element={<Ingredientes />} />
        <Route path="/receitas" element={<Receitas />} />
      </Routes>
    </BrowserRouter>
  );
}
