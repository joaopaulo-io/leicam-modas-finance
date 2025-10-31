export default function ModalProduct() {
  return (
    <div className="modal-overlay" id="modalAddProduct">
      <div className="modal">
        <h2>Adicionar Produto</h2>
        <form id="addProductForm">
          <div className="form-group">
            <label>Nome:</label>
            <input type="text" id="productName" required />
          </div>
          <div className="form-group">
            <label>Valor Unitário:</label>
            <input type="number" step="0.01" id="productValue" required />
          </div>
          <div className="form-group">
            <label>Quantidade:</label>
            <input type="number" id="productQuantity" min="1" required />
          </div>
          <div className="form-group">
            <label>Tamanho:</label>
            <input type="text" id="productSize" placeholder="P, M, G..." required />
          </div>
          <div className="form-group">
            <label>Tipo:</label>
            <select id="productType" required>
              <option value="">Selecione...</option>
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" className="btn-cancel" id="cancelModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
