// ==========================================
// 1. DADOS E VARIÁVEIS GLOBAIS
// ==========================================

// Recupera dados do navegador ou cria listas vazias para evitar erros
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
let carrinho = JSON.parse(localStorage.getItem('carrinhoRS_Tech')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlistRS_Tech')) || [];

// Elementos da tela (DOM)
const containerProdutos = document.getElementById('featured-products');
const tituloProdutos = document.getElementById('titulo-produtos');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountBadge = document.getElementById('cart-count-badge');

// Catálogo de Produtos
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


// ==========================================
// 2. LÓGICA DE SESSÃO (HEADER)
// ==========================================

function atualizarHeader() {
    const btnLogin = document.getElementById('btn-login');
    const userInfo = document.getElementById('user-info');
    
    // Verifica se os elementos existem antes de tentar mexer neles
    if (!btnLogin || !userInfo) return;

    if (usuarioLogado) {
        btnLogin.style.display = 'none';
        userInfo.style.display = 'flex';
        
        // Botão de Sair estilizado
        userInfo.innerHTML = `
            <span style="margin-right: 10px; font-weight: bold;">Olá, ${usuarioLogado.nome.split(' ')[0]}</span>
            <button onclick="logout()" class="btn-logout" title="Sair da conta">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;
    } else {
        btnLogin.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    location.reload();
}

// ==========================================
// 3. RENDERIZAR, FILTRAR E FAVORITAR
// ==========================================

function isFavorited(id) {
    return wishlist.includes(id);
}

function salvarWishlist() {
    localStorage.setItem('wishlistRS_Tech', JSON.stringify(wishlist));
}

function adicionarAosFavoritos(id) {
    // Verifica se já está na lista
    const index = wishlist.indexOf(id);
    
    if (index > -1) {
        wishlist.splice(index, 1); // Remove
        alert("Removido dos favoritos.");
    } else {
        wishlist.push(id); // Adiciona
        alert("Adicionado aos favoritos!");
    }
    
    salvarWishlist();
    carregarProdutos(); // Atualiza os ícones na tela
}

function carregarProdutos(listaOpcional) {
    // Se containerProdutos for nulo, o HTML está errado ou o script rodou antes da hora
    if (!containerProdutos) {
        console.error("ERRO: Elemento 'featured-products' não encontrado no HTML.");
        return;
    }

    const listaParaMostrar = listaOpcional || produtos; 
    containerProdutos.innerHTML = '';
    
    if (listaParaMostrar.length === 0) {
        containerProdutos.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado.</p>';
        return;
    }

    listaParaMostrar.forEach(produto => {
        // Lógica do coração vermelho/vazio
        const favoritado = isFavorited(produto.id);
        const classeBotao = favoritado ? 'favorited' : '';
        const classeIcone = favoritado ? 'fa-solid' : 'fa-regular';

        // HTML do Produto
        containerProdutos.innerHTML += `
            <div class="product-card">
                <div onclick="window.location.href='details.html?id=${produto.id}'" style="cursor: pointer;">
                    <img src="${produto.imagem}" alt="${produto.nome}" class="product-img">
                    <div class="product-info">
                        <span class="product-category">${produto.categoria}</span>
                        <h3>${produto.nome}</h3>
                    </div>
                </div>

                <div class="product-price">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="price-value">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button class="btn-favoritar ${classeBotao}" onclick="adicionarAosFavoritos(${produto.id})">
                            <i class="${classeIcone} fa-heart"></i>
                        </button>
                    </div>
                    <button class="btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Se não for filtro, reseta o título
    if (!listaOpcional && tituloProdutos) {
        tituloProdutos.innerText = "Produtos em Destaque";
    }
}

function filtrarProdutos(categoria) {
    const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
    
    if (tituloProdutos) {
        tituloProdutos.innerText = `Categoria: ${categoria}`;
    }
    
    carregarProdutos(produtosFiltrados);
    
    const areaProdutos = document.getElementById('area-produtos');
    if (areaProdutos) {
        areaProdutos.scrollIntoView({ behavior: 'smooth' });
    }
}


// ==========================================
// 4. LÓGICA DO CARRINHO
// ==========================================

function salvarCarrinho() {
    localStorage.setItem('carrinhoRS_Tech', JSON.stringify(carrinho));
    atualizarCarrinhoUI();
}

function toggleCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemCarrinho = carrinho.find(item => item.id === id);

    if (itemCarrinho) {
        itemCarrinho.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho();
    
    // Abre o carrinho para feedback visual
    if (cartSidebar && !cartSidebar.classList.contains('open')) {
        toggleCart();
    }
}

function removerDoCarrinho(id) {
    const item = carrinho.find(item => item.id === id);
    if (!item) return;

    if (item.quantidade > 1) {
        item.quantidade--;
    } else {
        carrinho = carrinho.filter(i => i.id !== id);
    }
    
    salvarCarrinho();
}

function atualizarCarrinhoUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let qtdTotal = 0;

    const limiteFrete = 350.00;
    const msgFrete = document.getElementById('frete-gratis-msg');

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
            qtdTotal += item.quantidade;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="img" style="width:50px; height:50px; object-fit:contain;">
                    <div class="item-details">
                        <h4 style="font-size:0.9rem; margin-bottom:5px;">${item.nome}</h4>
                        <div class="item-actions">
                            <span>${item.quantidade}x R$ ${item.preco.toFixed(2)}</span>
                            <i class="fa-solid fa-trash btn-remove" onclick="removerDoCarrinho(${item.id})" style="cursor:pointer; color:red; margin-left:10px;"></i>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Mensagem de Frete
    if (msgFrete) {
        if (total >= limiteFrete) {
            msgFrete.innerHTML = '<strong style="color: #00b37e;">Parabéns! Você ganhou FRETE GRÁTIS!</strong>';
        } else if (total > 0) {
            const falta = limiteFrete - total;
            msgFrete.innerHTML = `<span style="color: #f7a940;">Faltam R$ ${falta.toFixed(2).replace('.', ',')} para FRETE GRÁTIS!</span>`;
        } else {
            msgFrete.innerHTML = '';
        }
    }

    if (cartTotalValue) cartTotalValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if (cartCountBadge) cartCountBadge.innerText = qtdTotal;
}

function irParaCheckout() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    if (!usuarioLogado) {
        alert("Você precisa fazer login para finalizar a compra!");
        window.location.href = "login.html";
        return;
    }
    window.location.href = "checkout.html";
}


// ==========================================
// 5. INICIALIZAR TUDO
// ==========================================
// Espera o HTML carregar antes de rodar o JS
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema R&S TECH iniciado.");
    atualizarHeader();
    carregarProdutos();
    atualizarCarrinhoUI();
});