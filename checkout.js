    // Recupera o carrinho salvo
let carrinho = JSON.parse(localStorage.getItem('carrinhoRS_Tech')) || [];
const checkoutItemsContainer = document.getElementById('checkout-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');

// Elementos do endereço
const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');

// ==========================================
// 1. CARREGAR RESUMO DO PEDIDO
// ==========================================
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

    // Atualiza os valores na tela
    summarySubtotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    // Verifica qual método de pagamento está selecionado para aplicar desconto
    calcularTotalComDesconto(subtotal);
}

// Função auxiliar para calcular total final (Pix tem 5% de desconto)
function calcularTotalComDesconto(valorSubtotal) {
    const metodoPagamento = document.querySelector('input[name="pagamento"]:checked').value;
    let totalFinal = valorSubtotal;

    if (metodoPagamento === 'pix') {
        totalFinal = valorSubtotal * 0.95; 
    }

    summaryTotal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

// ==========================================
// 2. BUSCAR ENDEREÇO PELO CEP (API ViaCEP)
// ==========================================
cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, ''); 

    if (cep.length === 8) {
        ruaInput.value = "Buscando...";
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                ruaInput.value = data.logradouro;
                bairroInput.value = data.bairro;
                cidadeInput.value = `${data.localidade} - ${data.uf}`;
               
                document.querySelector('input[placeholder="Número"]')?.focus();
            } else {
                alert("CEP não encontrado!");
                limparEndereco();
            }
        } catch (error) {
            alert("Erro ao buscar CEP.");
            limparEndereco();
        }
    }
});

function limparEndereco() {
    ruaInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
}

// ==========================================
// 3. ALTERNAR FORMA DE PAGAMENTO
// ==========================================
const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
const cardDetails = document.getElementById('card-details');

radiosPagamento.forEach(radio => {
    radio.addEventListener('change', (e) => {
       
        let subtotalTexto = summarySubtotal.innerText.replace('R$ ', '').replace(',', '.');
        let subtotal = parseFloat(subtotalTexto);
        calcularTotalComDesconto(subtotal);

        
        if (e.target.value === 'cartao') {
            cardDetails.classList.remove('hide');
        } else {
            cardDetails.classList.add('hide');
        }
    });
});

// ==========================================
// 4. FINALIZAR PEDIDO
// ==========================================
function finalizarPedido() {
    // Validação simples
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    if (ruaInput.value === "") {
        alert("Por favor, preencha o endereço de entrega.");
        cepInput.focus();
        return;
    }

    
    const btnFinish = document.querySelector('.btn-finish');
    btnFinish.innerText = "PROCESSANDO...";
    btnFinish.disabled = true;

    setTimeout(() => {
        
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
        
    }, 2000); 
}


carregarResumo();