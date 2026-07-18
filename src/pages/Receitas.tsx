import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Toast from "../components/Toast";
import RecipeCard from "../components/RecipeCard";
import { BackIcon, SearchIcon } from "../components/icons";
import * as recipesRepository from "../repositories/recipesRepository";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import type { Ingredient, Recipe } from "../types";

interface ToastState {
  toast?: string;
}

export default function Receitas() {
  const location = useLocation();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(recipesRepository.getAll());
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

  const sortedRecipes = useMemo(
    () => [...recipes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(normalizedQuery),
    );
  }, [sortedRecipes, query]);

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
          Minhas Receitas
        </h2>
      </div>

      {recipes.length > 0 && (
        <div className="relative mb-4">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sageDark/40" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar receita..."
            className="w-full rounded-2xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        {recipes.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="text-4xl" aria-hidden="true">
              📖
            </span>
            <p className="text-sageDark/80">
              Você ainda não salvou nenhuma receita.
            </p>
            <Link
              to="/precificar"
              className="rounded-2xl bg-clay px-5 py-3 text-sm font-semibold text-white active:scale-[0.98]"
            >
              Criar minha primeira receita
            </Link>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <p className="py-10 text-center text-sageDark/70">
            Nenhuma receita encontrada para "{query}".
          </p>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              ingredients={ingredients}
            />
          ))
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </Layout>
  );
}
