document.addEventListener("DOMContentLoaded", function() {
    pegarDados()
    atualizarValorTotal()
})

function pegarDados() {
    const url = "data.json"
    fetch(url)
        .then((dados) => {return dados.json()})
        .then((data) => {montarHtml(data)})
}

function montarHtml(dados) {
    const products = document.querySelector(".products")
    let textHtml = ""

    for (item of dados) {
        let produto = `
        <div id="produto-${item.id}" class="product itens-menu" data-category="${item.categoria}">
              <img src="${item.imagem}">
              <h3>${item.nome}</h3>
              <p>${item.descricao}</p>
              <p>R$ ${item.valor.toFixed(2)}</p>
              <button class="fazer-pedido" onclick='fazerPedido(${JSON.stringify(item)})'>Pedir</button>
          </div>
        `
        textHtml += produto
    }
    products.innerHTML = textHtml
}

function diminuirQuantidade(valorProduto) {
    const quantidadeProduto = document.getElementById("quantidadePedido")
    const valorTotalPedido = document.getElementById("valorTotalPedido")
    let quantidade = Number(quantidadeProduto.innerHTML)

    if (quantidade > 1) {
        quantidade--
        quantidadeProduto.innerHTML = quantidade

        valorTotalPedido.innerHTML = (valorProduto * quantidade).toFixed(2)
    }
}

function aumentarQuantidade(valorProduto) {
    const quantidadePedido = document.getElementById("quantidadePedido")
    const valorTotalPedido = document.getElementById("valorTotalPedido")
    let quantidade = Number(quantidadePedido.innerHTML)

    quantidade++
    quantidadePedido.innerHTML = quantidade

    valorTotalPedido.innerHTML = (valorProduto * quantidade).toFixed(2)
}


function abrirModalPedido(item) {
    const modal = document.getElementById("modal-pedido");
    let conteudoModal = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${item.nome}</h2>
            </div>
            <div class="modal-body">
                <div>
                    <img src="${item.imagem}">
                </div>
                <div>
                    <p>Quantidade</p>
                    <button class="quantidade-btn" onclick="diminuirQuantidade(${item.valor})">−</button>
                    <span id="quantidadePedido">1</span>
                    <button class="quantidade-btn" onclick="aumentarQuantidade(${item.valor})">+</button>
                    <p>Valor Total <br><span id="valorTotalPedido">${(item.valor).toFixed(2)}</span></p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="pedido-btn cancela">Cancelar</button>
                <button class="pedido-btn confirma">Confirmar</button>
            </div>
        </div>
    `

    modal.innerHTML = conteudoModal;
    modal.classList.remove("hidden")
}

function fecharModal() {
    const modal = document.getElementsByClassName("modal");
    for (m of modal) {
        m.classList.add("hidden")
    }
}

function fazerPedido(item) {
    resultado = abrirModalPedido(item)

    document.querySelector(".pedido-btn.cancela").addEventListener("click", function() {
        cancelarPedido(item.id)
    })

    document.querySelector(".pedido-btn.confirma").addEventListener("click", function() {
        const quantidade = document.getElementById("quantidadePedido")
        const data = new Date()
        
        item['quantidade'] = Number(quantidade.innerHTML)
        item['horario'] = data.getHours() + ":" + data.getMinutes()

        quantidade.innerHTML = 1

        alert("Pedido realizado com sucesso!")

        salvarUltimoPedido(item)
        salvarHistoricoPedidos(item)
        atualizarValorTotal()

        fecharModal()
    })
}

function cancelarPedido(id) {
    const quantidadePedido = document.getElementById("quantidadePedido")
    quantidadePedido.innerHTML = "1"

    fecharModal()
}

function salvarUltimoPedido(pedido) {
    localStorage.setItem("lastOrder", JSON.stringify(pedido));
}

function salvarHistoricoPedidos(pedido) {
    if (localStorage.getItem("orderHistory") === null) {
        historicoPedidos = {itens: []};
    } else {
        historicoPedidos = JSON.parse(localStorage.getItem("orderHistory"));
    }
    historicoPedidos.itens.push(pedido);
    localStorage.setItem("orderHistory", JSON.stringify(historicoPedidos));
}

const itensMenu = document.querySelectorAll(".item-menu")
itensMenu.forEach(item => {
    item.addEventListener("click", function(event) {
        removerSelecionados()
        event.target.classList.add("selected")
    })
})

function filtrarItensMenu(elemento, categoria) {
    removerSelecionado(elemento)
    const products = document.querySelectorAll(".product")
    if (elemento.id === "all-products") {
        for (item of products) {
            item.classList.remove("hidden")
        }
    } else {
        for (item of products) {
            if (item.getAttribute("data-category") === categoria) {
                item.classList.remove("hidden")
            } else {
                item.classList.add("hidden")
            }
        }
    }
}

function removerSelecionado(item) {
    item.classList.remove("selected")
}

function removerSelecionados() {
    for (item of itensMenu) {
        item.classList.remove("selected")
    }
}

function abrirModalHistoricoPedidos(pedidos) {
    const modal = document.getElementById("modal-historico-pedidos")
    const campoPedidos = document.getElementById("historico-pedidos")
    let listaHistoricoPedidos = ""
    let total = 0

    for (p of pedidos) {
        total += p.valor * p.quantidade
        listaHistoricoPedidos += `
        <tr>
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>${p.horario}</td>
            <td>R$ ${(p.valor * p.quantidade).toFixed(2)}</td>
        </tr>
        `
    }

    listaHistoricoPedidos += `
    <tr>
        <td>TOTAL</td>
        <td></td>
        <td></td>
        <td>R$ ${(total).toFixed(2)}</td>
    </tr>
    `
    campoPedidos.innerHTML = listaHistoricoPedidos
    modal.classList.remove("hidden")
}

function listarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem("orderHistory"))

    if (pedidos === null) {
        alert("Você não efetuou nenhum pedido ainda.")
    } else {
        abrirModalHistoricoPedidos(pedidos.itens)
    }
}

function atualizarValorTotal() {
    let pedidos = JSON.parse(localStorage.getItem("orderHistory"))
    if (pedidos !== null) {
        pedidos = pedidos.itens
        const valorTotal = document.getElementById("valorTotal")
        let novoValor = 0
    
        for (p of pedidos) {
            novoValor += Number(p.valor * p.quantidade)
        }
    
        valorTotal.innerHTML = novoValor.toFixed(2)
    }
}

function abrirModalMensagem(mensagem) {
    const modal = document.getElementById("modal-mensagem")
    const localMensagem = document.getElementById("mensagem")

    modal.classList.remove("hidden")
    localMensagem.innerHTML = mensagem

    setTimeout(() => {
        fecharModal()
    }, 9000);
}