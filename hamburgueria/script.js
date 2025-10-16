// Array para armazenar os itens do carrinho
let carrinho = [];

// Funções para abrir e fechar o modal do carrinho
function abrirCarrinho() {
    const modal = document.getElementById('cart-modal');
    modal.classList.add('active');
    atualizarCarrinho();
}

function fecharCarrinho() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('active');
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        fecharCarrinho();
    }
}

// Função para atualizar o contador do carrinho no ícone
function atualizarContadorCarrinho() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = carrinho.length;
    
    // Animação ao adicionar item
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

// Função para adicionar produto ao carrinho
function adicionarProduto(nome, preco) {
    // Adiciona o produto ao array do carrinho
    carrinho.push({
        nome: nome,
        preco: preco
    });

    // Atualiza a exibição do carrinho
    atualizarCarrinho();
    
    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();

    // Feedback visual (opcional)
    mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

// Função para remover produto do carrinho
function removerProduto(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    atualizarContadorCarrinho();
}

// Função para atualizar a exibição do carrinho no modal
function atualizarCarrinho() {
    const carrinhoItems = document.getElementById('modal-carrinho-items');
    const totalValor = document.getElementById('modal-total-valor');

    // Limpa o conteúdo atual
    carrinhoItems.innerHTML = '';

    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        carrinhoItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        totalValor.textContent = 'R$ 0,00';
        return;
    }

    // Adiciona cada item do carrinho
    carrinho.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
            </div>
            <button class="btn-remove" onclick="removerProduto(${index})">Remover</button>
        `;
        carrinhoItems.appendChild(itemDiv);
    });

    // Calcula e atualiza o total
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para mostrar notificação (feedback visual)
function mostrarNotificacao(mensagem) {
    // Cria elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #FF1493;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(255, 20, 147, 0.5);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notificacao);

    // Remove a notificação após 2 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 2000);
}

// Adiciona animações CSS para as notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Função para finalizar o pedido e enviar para o WhatsApp
function finalizarPedido() {
    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione produtos antes de finalizar o pedido.');
        return;
    }

    // Pega os dados do cliente do modal
    const nome = document.getElementById('modal-cliente-nome').value.trim();
    const endereco = document.getElementById('modal-cliente-endereco').value.trim();

    // Valida os dados do cliente
    if (!nome || !endereco) {
        alert('Por favor, preencha seu nome e endereço para finalizar o pedido.');
        return;
    }

    // Monta a mensagem do pedido
    let mensagem = `*Olá! Gostaria de fazer um pedido:*\n\n`;
    mensagem += `*📋 Resumo do Pedido:*\n`;

    // Adiciona cada item do carrinho
    carrinho.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    // Calcula o total
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    mensagem += `\n*💰 Total: R$ ${total.toFixed(2)}*\n\n`;

    // Adiciona os dados do cliente
    mensagem += `*👤 Nome:* ${nome}\n`;
    mensagem += `*📍 Endereço de Entrega:* ${endereco}\n\n`;
    mensagem += `Aguardo confirmação! 😊`;

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Número do WhatsApp (com código do país e DDD)
    const numeroWhatsApp = '5511983625454';

    // Monta o link do WhatsApp
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    // Redireciona para o WhatsApp
    window.open(linkWhatsApp, '_blank');
    
    // Fecha o modal após enviar
    fecharCarrinho();
}

// Inicializa o carrinho vazio ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();
    atualizarContadorCarrinho();
});

// Adiciona transição suave ao contador
const style2 = document.createElement('style');
style2.textContent = `
    .cart-badge {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style2);

