// ==========================================
// PÁGINA DE DETALHES - LÓGICA
// ==========================================

// 1. DADOS (Mesma lista do home.js para simplificar)
const produtos = [
     { id: 1, nome: "Notebook Gamer Legion 5", preco: 6299.00, categoria: "Notebooks", imagem: "https://m.media-amazon.com/images/I/71S4sIPFvBL._AC_SX679_.jpg" },
    { id: 2, nome: "Monitor Dell UltraSharp 27''", preco: 2199.50, categoria: "Monitores", imagem: "https://m.media-amazon.com/images/I/61rd8zerEqL._AC_SX679_.jpg" },
    { id: 3, nome: "Mouse Gamer Logitech G502", preco: 320.90, categoria: "Periféricos", imagem: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg" },
    { id: 4, nome: "Teclado Mecânico HyperX Alloy", preco: 499.90, categoria: "Periféricos", imagem: "https://m.media-amazon.com/images/I/61TxVbU-nBL._AC_SX679_.jpg" },
    { id: 5, nome: "Headset Gamer 7.1 Surround", preco: 450.00, categoria: "Periféricos", imagem: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SX466_.jpg" },
    { id: 6, nome: "Placa de Vídeo RTX 4070", preco: 5199.00, categoria: "Componentes", imagem: "https://m.media-amazon.com/images/I/71Uq1Djh3EL._AC_SX679_.jpg" },
    { id: 7, nome: "SSD NVMe Samsung 1TB", preco: 689.00, categoria: "Componentes", imagem: "https://m.media-amazon.com/images/I/61ciknSL0lL._AC_SX679_.jpg" },
    { id: 8, nome: "Cadeira Gamer ThunderX3", preco: 1299.00, categoria: "Acessórios", imagem: "https://m.media-amazon.com/images/I/71se5EPcaIL._AC_SY879_.jpg" },
    {id: 9,  nome: "Webcam Full HD 1080p", preco: 129.90, categoria: "Acessórios", imagem: "https://m.media-amazon.com/images/I/61-K2lXmHQL._AC_SX522_.jpg" },
];

// 2. RECUPERAR ID DA URL
const urlParams = new URLSearchParams(window.location.search);
const produtoId = parseInt(urlParams.get('id'));

// 3. BUSCAR PRODUTO
const produto = produtos.find(p => p.id === produtoId);

// Se não achar o produto, volta pra home
if (!produto) {
    alert("Produto não encontrado!");
    window.location.href = "index.html";
}

// 4. PREENCHER A TELA
document.getElementById('page-title').innerText = `${produto.nome} | R&S TECH`;
document.getElementById('product-category').innerText = produto.categoria;
document.getElementById('product-name').innerText = produto.nome;
document.getElementById('product-price').innerText = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
document.getElementById('main-product-image').src = produto.imagem;

// Adiciona uma descrição padrão se não tiver específica
document.getElementById('product-description-text').innerText = produto.descricao || "Este é um produto de alta qualidade, selecionado especialmente para a R&S TECH. Garantia de 12 meses e suporte técnico especializado.";


// 5. FUNCIONALIDADE: ADICIONAR AO CARRINHO (Replicando lógica do home.js)
const btnAddToCart = document.getElementById('add-to-cart-btn');

btnAddToCart.addEventListener('click', () => {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRS_Tech')) || [];
    const quantidadeInput = document.getElementById('product-quantity').value;
    const qtd = parseInt(quantidadeInput);

    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += qtd;
    } else {
        carrinho.push({ ...produto, quantidade: qtd });
    }

    localStorage.setItem('carrinhoRS_Tech', JSON.stringify(carrinho));
    
    // Feedback visual
    btnAddToCart.innerText = "Adicionado!";
    btnAddToCart.style.background = "#00b37e";
    
    setTimeout(() => {
        window.location.href = "index.html"; // Volta pra home para ver o carrinho
    }, 500);
});

// 6. FUNCIONALIDADE: SIMULAR FRETE
const btnCalcularFrete = document.getElementById('check-shipping-btn');
const resultadoFrete = document.getElementById('shipping-result');

btnCalcularFrete.addEventListener('click', async () => {
    const cep = document.getElementById('shipping-cep').value;
    
    if (cep.length !== 8 && cep.length !== 9) {
        alert("CEP inválido");
        return;
    }

    resultadoFrete.innerText = "Calculando...";
    
    // Simulação fake para MVP (poderia usar API real de transportadora)
    setTimeout(() => {
        const valorFrete = (Math.random() * 50) + 10; // Valor entre 10 e 60
        const dias = Math.floor(Math.random() * 5) + 2; // Dias entre 2 e 7
        
        resultadoFrete.innerHTML = `
            <span style="color: #00b37e;">Frete Econômico: R$ ${valorFrete.toFixed(2).replace('.', ',')}</span><br>
            <span style="color: #ccc; font-size: 0.9rem;">Prazo de entrega: ${dias} dias úteis</span>
        `;
    }, 1000);
});

// 7. HEADER (Login) - Cópia simplificada para manter o header funcionando
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const authArea = document.getElementById('auth-area');
if (usuarioLogado) {
    authArea.innerHTML = `<span style="color:white; margin-right:10px">Olá, ${usuarioLogado.nome.split(' ')[0]}</span>`;
} else {
    authArea.innerHTML = `<a href="login.html" style="color:white;">Entrar</a>`;
}