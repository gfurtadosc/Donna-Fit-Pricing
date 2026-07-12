import Layout from "../components/Layout";
import NavButton from "../components/NavButton";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <NavButton to="/precificar" label="Precificar" variant="primary" />
        <NavButton to="/ingredientes" label="Ingredientes" />
        <NavButton to="/receitas" label="Minhas Receitas" />
      </div>
    </Layout>
  );
}
