// ==========================================
// 1. VERIFICAÇÃO DE LOGIN & DADOS
// ==========================================
const authArea = document.getElementById('auth-area');
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

function atualizarHeader() {
    if (usuarioLogado) {
        authArea.innerHTML = `
            <div class="user-info">
                <span>Olá, <strong>${usuarioLogado.nome.split(' ')[0]}</strong></span>
                <button onclick="fazerLogout()" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        `;
    } else {
        authArea.innerHTML = `<a href="login.html" class="btn-nav-login">Entrar</a>`;
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload();
}
atualizarHeader();

// ==========================================
// 2. BANCO DE DADOS (Imagens Atualizadas)
// ==========================================
const produtos = [
    {
        id: 1,
        nome: "Mouse Gamer RGB Redragon",
        categoria: "Periféricos",
        preco: 159.90,
        imagem: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg"
    },
    {
        id: 2,
        nome: "Teclado Mecânico Switch Blue",
        categoria: "Periféricos",
        preco: 249.90,
        imagem: "https://m.media-amazon.com/images/I/61TxVbU-nBL._AC_SX679_.jpg"
    },
    {
        id: 3,
        nome: "Headset Gamer 7.1 Surround",
        categoria: "Áudio",
        preco: 199.00,
        imagem: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SX466_.jpg"
    },
    {
        id: 4,
        nome: "Monitor Gamer 144hz 24pol",
        categoria: "Monitores",
        preco: 1200.00,
        imagem: "https://m.media-amazon.com/images/I/61rd8zerEqL._AC_SX679_.jpg"
    },
    {
        id: 5,
        nome: "Notebook Gamer Nitro 5",
        categoria: "Notebooks",
        preco: 4500.00,
        imagem: "https://m.media-amazon.com/images/I/71S4sIPFvBL._AC_SX679_.jpg"
    },
    {
        id: 6,
        nome: "Webcam Full HD 1080p",
        categoria: "Acessórios",
        preco: 129.90,
        imagem: "https://m.media-amazon.com/images/I/61-K2lXmHQL._AC_SX522_.jpg"
    }
];

// ==========================================
// ==========================================
// 3. RENDERIZAR E FILTRAR PRODUTOS
// ==========================================
const containerProdutos = document.getElementById('featured-products');
const tituloProdutos = document.getElementById('titulo-produtos');


function carregarProdutos(listaOpcional) {
    const listaParaMostrar = listaOpcional || produtos; 

    containerProdutos.innerHTML = '';
    
    
    if (listaParaMostrar.length === 0) {
        containerProdutos.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    listaParaMostrar.forEach(produto => {
        containerProdutos.innerHTML += `
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-img">
                <div class="product-info">
                    <span class="product-category">${produto.categoria}</span>
                    <h3>${produto.nome}</h3>
                    <div class="product-price">
                        <span class="price-value">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button class="btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    
    if (!listaOpcional) {
        tituloProdutos.innerText = "Produtos em Destaque";
    }
}


function filtrarProdutos(categoria) {
    
    const produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    
    
    tituloProdutos.innerText = `Categoria: ${categoria}`;
    
    
    carregarProdutos(produtosFiltrados);

   
    document.getElementById('area-produtos').scrollIntoView({ behavior: 'smooth' });
}

    
    carregarProdutos();

// ==========================================
// 4. LÓGICA DO CARRINHO (SIDEBAR COMPLETA)
// ==========================================


let carrinho = JSON.parse(localStorage.getItem('carrinhoRS_Tech')) || [];


const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountBadge = document.querySelector('.cart-count');


function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    
    
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinhoUI();
    abrirCarrinho(); 
}


function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarCarrinhoUI();
}


function salvarCarrinho() {
    localStorage.setItem('carrinhoRS_Tech', JSON.stringify(carrinho));
}


function atualizarCarrinhoUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Teu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
            quantidadeTotal += item.quantidade;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="img">
                    <div class="item-details">
                        <h4>${item.nome}</h4>
                        <div class="item-actions">
                            <span>${item.quantidade}x R$ ${item.preco.toFixed(2)}</span>
                            <i class="fa-solid fa-trash btn-remove" onclick="removerDoCarrinho(${item.id})"></i>
                        </div>
                    </div>
                </div>
            `;
        });
    }

   
    if(cartTotalValue) cartTotalValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if(cartCountBadge) cartCountBadge.innerText = quantidadeTotal;
}


function abrirCarrinho() {
    if(cartSidebar) cartSidebar.classList.add('open');
    if(cartOverlay) cartOverlay.classList.add('open');
}

function fecharCarrinho() {
    if(cartSidebar) cartSidebar.classList.remove('open');
    if(cartOverlay) cartOverlay.classList.remove('open');
}


const cartIcon = document.querySelector('.cart-icon');
if(cartIcon) cartIcon.addEventListener('click', abrirCarrinho);
if(cartOverlay) cartOverlay.addEventListener('click', fecharCarrinho);


atualizarCarrinhoUI();

function irParaCheckout() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    window.location.href = "checkout.html";
}