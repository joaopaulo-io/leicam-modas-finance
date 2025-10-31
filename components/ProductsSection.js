export default function ProductsSection() {
  return (
    <section className="products__container container">
      <div className="products__title">
        <h1>Meus Produtos</h1>
      </div>

      <div className="products">
        <div className="actions">
          <div className="buttons">
            {/* Botão Adicionar */}
            <button id="btnAdd" className="action-btn add-btn">
              <span className="material-icons-sharp">add</span>
              <span className="btn-text">Adicionar</span>
            </button>

            {/* Botão Baixar */}
            <button id="btnDownload" className="action-btn download-btn">
              <span className="material-icons-sharp">download</span>
              <span className="btn-text">Baixar</span>
            </button>
          </div>

          <div className="search-bar">
            <span className="material-icons-sharp">search</span>
            <input type="search" placeholder="Buscar..." />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Valor Unitário</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  );
}
