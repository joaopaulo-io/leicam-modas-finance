export default function StockSection() {
  return (
    <section className="stock__container container">
      <div className="stock__title">
        <h1>Meu Estoque</h1>
      </div>

      <div className="stock">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Valor Total</th>
              <th>Quantidade</th>
              <th>Tamanho</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  );
}
