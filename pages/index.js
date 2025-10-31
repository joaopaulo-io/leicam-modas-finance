import Head from "next/head";
import Script from "next/script";
import NavBar from "../components/NavBar";
import InsightCard from "../components/InsightCard";
import ProductsSection from "../components/ProductsSection";
import StockSection from "../components/StockSection";
import ModalProduct from "../components/ModalProduct";

export default function Home() {
  return (
    <>
      <Head>
        <title>Controle Financeiro - Leicam Modas</title>
      </Head>
      

      {/* JS Libraries */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"
        strategy="beforeInteractive"
      />

      {/* Custom JS */}
      <Script src="/scripts.js" strategy="afterInteractive" />

      <NavBar />

      <main>
        <section className="insights__container container" aria-labelledby="insights-title">
          <header className="insights__title">
            <h1 id="insights-title">Meu Financeiro</h1>
          </header>

          <div className="insights">
            <InsightCard
              icon="analytics"
              title="Caixa Acumulado"
              value="R$ 0,00"
              subtitle="Últimas 24 horas"
              ariaLabel="Caixa Acumulado: R$ 0,00"
            />
            <InsightCard
              icon="bar_chart"
              title="Custos e Despesas"
              value="R$ 0,00"
              subtitle="Últimas 24 horas"
              ariaLabel="Custos e Despesas: R$ 0,00"
            />
            <InsightCard
              icon="stacked_line_chart"
              title="Entradas de Caixa"
              value="R$ 0,00"
              subtitle="Últimas 24 horas"
              ariaLabel="Entradas de Caixa: R$ 0,00"
            />
          </div>
        </section>

        <ProductsSection />
        <StockSection />
      </main>

      <ModalProduct />
    </>
  );
}
