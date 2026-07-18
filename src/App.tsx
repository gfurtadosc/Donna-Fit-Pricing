import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Precificar from "./pages/Precificar";
import Ingredientes from "./pages/Ingredientes";
import IngredienteForm from "./pages/IngredienteForm";
import Receitas from "./pages/Receitas";
import ReceitaDetalhe from "./pages/ReceitaDetalhe";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/precificar" element={<Precificar />} />
        <Route path="/ingredientes" element={<Ingredientes />} />
        <Route path="/ingredientes/novo" element={<IngredienteForm />} />
        <Route path="/ingredientes/:id/editar" element={<IngredienteForm />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/receitas/:id" element={<ReceitaDetalhe />} />
      </Routes>
    </BrowserRouter>
  );
}
