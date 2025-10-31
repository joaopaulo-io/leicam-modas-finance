// public/scripts.js

// ========================
// ELEMENTOS DOM
// ========================
const addButton = document.querySelector('#btnAdd');
const productTableBody = document.querySelector('.products tbody');
const stockTableBody = document.querySelector('.stock tbody');
const searchInput = document.querySelector('.search-bar input');
const modal = document.getElementById('modalAddProduct');
const cancelModalBtn = document.getElementById('cancelModal');
const addProductForm = document.getElementById('addProductForm');

const inputName = document.getElementById('productName');
const inputValue = document.getElementById('productValue');
const inputQuantity = document.getElementById('productQuantity');
const inputSize = document.getElementById('productSize');
const inputType = document.getElementById('productType');

const themeToggler = document.querySelector(".theme-toggler");
const lightIcon = themeToggler.querySelector('span:nth-child(1)');
const darkIcon = themeToggler.querySelector('span:nth-child(2)');
const btnDownload = document.getElementById('btnDownload');

let editingId = null;
const API_URL = '/api/products';

// ========================
// TEMA (Light / Dark)
// ========================
function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme-variables', isDark);
    lightIcon.classList.toggle('active', !isDark);
    darkIcon.classList.toggle('active', isDark);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme-variables');
    lightIcon.classList.toggle('active', !isDark);
    darkIcon.classList.toggle('active', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ========================
// MODAL
// ========================
function openModal(isEdit = false) {
    modal.classList.add('active');
    modal.querySelector('h2').textContent = isEdit ? 'Editar Produto' : 'Adicionar Produto';
}

function closeModal() {
    modal.classList.remove('active');
    addProductForm.reset();
    editingId = null;
}

// ========================
// FETCH FUNCTIONS (CRUD)
// ========================
async function getProducts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Erro ao buscar produtos');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function addProduct(product) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Erro ao adicionar produto');
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function updateProduct(id, product) {
    try {
        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...product })
        });
        if (!res.ok) throw new Error('Erro ao atualizar produto');
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function deleteProductById(id) {
    try {
        const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao deletar produto');
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

// ========================
// UTILITÁRIOS
// ========================
function calculateTotals(products) {
    return products.reduce((totals, p) => {
        const subtotal = (p.valor || 0) * (p.quantidade || 1);
        if (p.tipo === 'Entrada') totals.entrada += subtotal;
        else totals.saida += subtotal;
        return totals;
    }, { entrada: 0, saida: 0 });
}

function formatCurrency(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// ========================
// ATUALIZAÇÃO DE CARDS FINANCEIROS
// ========================
async function updateFinancialCards() {
    const products = await getProducts();
    const totals = calculateTotals(products);

    // Seleciona todos os cards pelo novo componente React InsightCard
    const cards = document.querySelectorAll('.insight-card');
    // Supondo ordem: Caixa Acumulado, Custos e Despesas, Entradas
    if (cards.length === 3) {
        cards[0].querySelector('h1').textContent = formatCurrency(totals.entrada - totals.saida); // Caixa Acumulado
        cards[1].querySelector('h1').textContent = formatCurrency(totals.saida); // Custos e Despesas
        cards[2].querySelector('h1').textContent = formatCurrency(totals.entrada); // Entradas
    }
}


// ========================
// RENDER TABLES
// ========================
function createProductRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.nome}</td>
        <td>${formatCurrency(product.valor)}</td>
        <td>${product.data}</td>
        <td>${product.tipo}</td>
        <td class="actions-cell">
            <button class="edit-btn" data-id="${product.id}"><span class="material-icons-sharp">edit</span></button>
            <button class="delete-btn" data-id="${product.id}"><span class="material-icons-sharp">delete</span></button>
        </td>
    `;
    return row;
}

function createStockRow(product) {
    const row = document.createElement('tr');
    const total = (product.valor || 0) * (product.quantidade || 1);
    row.innerHTML = `
        <td>${product.nome}</td>
        <td>${formatCurrency(total)}</td>
        <td>${product.quantidade}</td>
        <td>${product.tamanho}</td>
    `;
    return row;
}

async function renderProductTable(filterText = '') {
    const products = await getProducts();
    productTableBody.innerHTML = '';

    const filteredProducts = products.filter(p => p.nome.toLowerCase().includes(filterText.toLowerCase()));
    filteredProducts.forEach(product => productTableBody.appendChild(createProductRow(product)));

    productTableBody.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', async e => {
            const id = Number(e.currentTarget.dataset.id);
            if (confirm('Deseja realmente excluir este produto?')) {
                await deleteProductById(id);
                await renderProductTable(searchInput.value);
                await renderStockTable();
                await updateFinancialCards();
            }
        })
    );

    productTableBody.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', e => {
            const id = Number(e.currentTarget.dataset.id);
            const product = products.find(p => p.id === id);
            if (!product) return;

            inputName.value = product.nome;
            inputValue.value = product.valor;
            inputQuantity.value = product.quantidade;
            inputSize.value = product.tamanho;
            inputType.value = product.tipo;
            editingId = id;
            openModal(true);
        })
    );
}

async function renderStockTable() {
    const products = await getProducts();
    stockTableBody.innerHTML = '';
    products.forEach(p => stockTableBody.appendChild(createStockRow(p)));
}

// ========================
// FORM SUBMIT
// ========================
addProductForm.addEventListener('submit', async e => {
    e.preventDefault();

    const product = {
        nome: inputName.value.trim(),
        valor: parseFloat(inputValue.value),
        quantidade: parseInt(inputQuantity.value),
        tamanho: inputSize.value.trim(),
        tipo: inputType.value,
        data: new Date().toLocaleDateString('pt-BR')
    };

    if (!product.nome || isNaN(product.valor) || isNaN(product.quantidade) || !product.tamanho || !product.tipo) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    if (editingId) await updateProduct(editingId, product);
    else await addProduct(product);

    closeModal();
    await renderProductTable(searchInput.value);
    await renderStockTable();
    await updateFinancialCards();
});

// ========================
// EXPORTAR PDF
// ========================
btnDownload.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const products = await getProducts();
    if (!products.length) return alert('Nenhum produto encontrado para exportar.');

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Produtos - Leicam Modas', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 28);

    // ====== Valores dos cards ======
    const cards = document.querySelectorAll('.insight-card');
    if (cards.length === 3) {
        const caixa = cards[0].querySelector('h1').textContent;
        const custos = cards[1].querySelector('h1').textContent;
        const entradas = cards[2].querySelector('h1').textContent;

        doc.setFontSize(12);
        doc.text(`Caixa Acumulado: ${caixa}`, 14, 36);
        doc.text(`Custos e Despesas: ${custos}`, 14, 44);
        doc.text(`Entradas: ${entradas}`, 14, 52);
    }

    // ====== Tabela de produtos ======
    const tableData = products.map(p => [
        p.nome,
        formatCurrency(p.valor),
        p.data,
        p.tipo,
        p.quantidade,
        p.tamanho,
        formatCurrency(p.valor * p.quantidade)
    ]);

    doc.autoTable({
        startY: 60,
        head: [['Produto', 'Valor Unitário', 'Data', 'Tipo', 'Quantidade', 'Tamanho', 'Total']],
        body: tableData
    });

    doc.save('relatorio_produtos.pdf');
});


// ========================
// EVENTOS
// ========================
addButton.addEventListener('click', () => openModal());
cancelModalBtn.addEventListener('click', closeModal);
searchInput.addEventListener('input', e => renderProductTable(e.target.value));
themeToggler.addEventListener('click', toggleTheme);

// ========================
// INIT
// ========================
loadTheme();
renderProductTable();
renderStockTable();
updateFinancialCards();
