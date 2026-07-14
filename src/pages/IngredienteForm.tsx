import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import IngredientFields from "../components/IngredientFields";
import { BackIcon } from "../components/icons";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import type { Ingredient } from "../types";

export default function IngredienteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [ingredient, setIngredient] = useState<Ingredient | undefined>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const existing = ingredientsRepository.getById(id);
    if (!existing) {
      setNotFound(true);
      return;
    }
    setIngredient(existing);
  }, [id]);

  function handleSaved() {
    navigate("/ingredientes", { state: { toast: "Ingrediente salvo" } });
  }

  if (notFound) {
    return (
      <Layout>
        <p className="text-sageDark">Ingrediente não encontrado.</p>
        <Link
          to="/ingredientes"
          className="mt-4 inline-block font-semibold text-clay underline"
        >
          Voltar para a lista
        </Link>
      </Layout>
    );
  }

  if (isEditing && !ingredient) {
    return <Layout>{null}</Layout>;
  }

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/ingredientes"
          aria-label="Voltar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
        >
          <BackIcon className="h-5 w-5" />
        </Link>
        <h2 className="font-display text-xl font-semibold text-sageDark">
          {isEditing ? "Editar ingrediente" : "Novo ingrediente"}
        </h2>
      </div>

      <IngredientFields ingredient={ingredient} onSaved={handleSaved} />
    </Layout>
  );
}
