import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import IngredientCard from "../components/IngredientCard";
import { BackIcon, SearchIcon } from "../components/icons";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import type { Ingredient } from "../types";

interface ToastState {
  toast?: string;
}

export default function Ingredientes() {
  const location = useLocation();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Ingredient | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIngredients(ingredientsRepository.getAll());
  }, []);

  useEffect(() => {
    const state = location.state as ToastState | null;
    if (state?.toast) {
      setToastMessage(state.toast);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ingredients
      .filter((ingredient) =>
        ingredient.name.toLowerCase().includes(normalizedQuery),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [ingredients, query]);

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    ingredientsRepository.remove(pendingDelete.id);
    setIngredients(ingredientsRepository.getAll());
    setToastMessage("Ingrediente excluído");
    setPendingDelete(null);
  }

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/"
          aria-label="Voltar para a Home"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
        >
          <BackIcon className="h-5 w-5" />
        </Link>
        <h2 className="font-display text-xl font-semibold text-sageDark">
          Ingredientes
        </h2>
      </div>

      {ingredients.length > 0 && (
        <div className="relative mb-4">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sageDark/40" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar ingrediente..."
            className="w-full rounded-2xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        {ingredients.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="text-4xl" aria-hidden="true">
              🥗
            </span>
            <p className="text-sageDark/80">
              Você ainda não cadastrou nenhum ingrediente.
            </p>
            <Link
              to="/ingredientes/novo"
              className="rounded-2xl bg-clay px-5 py-3 text-sm font-semibold text-white active:scale-[0.98]"
            >
              Cadastrar o primeiro ingrediente
            </Link>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <p className="py-10 text-center text-sageDark/70">
            Nenhum ingrediente encontrado para "{query}".
          </p>
        ) : (
          filteredIngredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={() => navigate(`/ingredientes/${ingredient.id}/editar`)}
              onDelete={() => setPendingDelete(ingredient)}
            />
          ))
        )}
      </div>

      <div className="sticky bottom-0 -mx-6 mt-4 bg-cream px-6 pb-2 pt-4">
        <Link
          to="/ingredientes/novo"
          className="block w-full rounded-2xl bg-clay px-6 py-4 text-center text-base font-semibold text-white shadow-sm active:scale-[0.98]"
        >
          + Novo Ingrediente
        </Link>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={`Excluir ${pendingDelete.name}?`}
          description="Essa ação não pode ser desfeita."
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </Layout>
  );
}
