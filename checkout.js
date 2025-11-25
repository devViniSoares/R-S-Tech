let carrinho = JSON.parse(localStorage.getItem('carrinhoRS_Tech')) || [];
const checkoutItemsContainer = document.getElementById('checkout-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');

// 2. CARREGAR RESUMO
function carregarResumo() {
    if (carrinho.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    checkoutItemsContainer.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;

        // O CSS agora vai forçar essa imagem a ter 60px
        checkoutItemsContainer.innerHTML += `
            <div class="checkout-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div>
                    <h4>${item.nome}</h4>
                    <p>Qtd: ${item.quantidade}</p>
                </div>
                <div>
                    <strong>R$ ${totalItem.toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
        `;
    });

    summarySubtotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    calcularTotalComDesconto(subtotal);
}

function calcularTotalComDesconto(valorSubtotal) {
    // Verifica qual radio está marcado
    const metodoPagamento = document.querySelector('input[name="pagamento"]:checked');
    let totalFinal = valorSubtotal;

    // Se Pix estiver marcado, aplica 5%
    if (metodoPagamento && metodoPagamento.value === 'pix') {
        totalFinal = valorSubtotal * 0.95;
    }

    summaryTotal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

// 3. LISTENERS DE MUDANÇA DE PAGAMENTO
const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
radiosPagamento.forEach(radio => {
    radio.addEventListener('change', () => {
        let subtotalTexto = summarySubtotal.innerText.replace('R$ ', '').replace('.', '').replace(',', '.');
        let subtotal = parseFloat(subtotalTexto);
        calcularTotalComDesconto(subtotal);
    });
});

// 4. API VIACEP
const cepInput = document.getElementById('cep');
if (cepInput) {
    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = `${data.localidade} - ${data.uf}`;
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}

// 5. FUNÇÃO DO BOTÃO FINALIZAR
function finalizarPedido() {
    console.log("Botão clicado!"); 

    if (carrinho.length === 0) {
        alert("Carrinho vazio! Adicione produtos.");
        return;
    }

    const rua = document.getElementById('rua').value;
    if (rua === "") {
        alert("Por favor, preencha o CEP e o endereço.");
        return;
    }

    
    const numeroPedido = Math.floor(Math.random() * 900000) + 100000;
    const dadosPedido = {
        numero: numeroPedido,
        total: summaryTotal.innerText,
        data: new Date().toLocaleDateString(),
        itens: carrinho
    };

    localStorage.setItem('ultimoPedido', JSON.stringify(dadosPedido));
    localStorage.removeItem('carrinhoRS_Tech');


    window.location.href = "orders.html";
}

carregarResumo();