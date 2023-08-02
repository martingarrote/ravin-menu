document.addEventListener("DOMContentLoaded", function() {
    pegarDados()
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
        <div id="produto-${item.id}" class="product itens-menu}" data-category="${item.categoria}">
              <img src="${item.imagem}">
              <h3>${item.nome}</h3>
              <p>${item.descricao}</p>
              <div>
                <button class="quantidade-btn" onclick="diminuirQuantidade(${item.id})">&#x2212;</button>
                <span id="qtd-${item.id}">1</span>
                <button class="quantidade-btn" onclick="aumentarQuantidade(${item.id})">&#x2b;</button>
              </div>
              <button class="fazer-pedido" onclick='fazerPedido(${JSON.stringify(item)})'>Pedir</button>
          </div>
        `
        textHtml += produto
    }
    products.innerHTML = textHtml
}

function diminuirQuantidade(id) {
    const qtdPedido = document.getElementById(`qtd-${id}`)
    let quantidade = Number(qtdPedido.innerHTML)
    if (quantidade > 1) {
        quantidade--
        qtdPedido.innerHTML = quantidade
    }
}

function aumentarQuantidade(id) {
    const qtdPedido = document.getElementById(`qtd-${id}`)
    let quantidade = Number(qtdPedido.innerHTML)
    quantidade++
    qtdPedido.innerHTML = quantidade
}

function abrirModal(item) {
    const modal = document.querySelector(".modal-pedido");
    const quantidade = document.getElementById(`qtd-${item.id}`).innerHTML
    let conteudoModal = `
        <div class="modal-pedido">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${item.nome}</h2>
                    <img src="${item.imagem}">
                </div>
                <div class="modal-body">
                    <p>Quantidade <br>${quantidade}</p>
                    <p>Valor Total <br>R$ <span id="valorTotal">${item.valor * quantidade}</span></p>
                </div>
                <div class="modal-footer">
                    <button class="pedido-btn confirma">Confirmar</button>
                    <button class="pedido-btn cancela">Cancelar</button>
                </div>
            </div>
        </div>      
    `
    modal.innerHTML = conteudoModal;
    modal.classList.remove("hidden")
}

function fecharModal() {
    const modal = document.querySelector(".modal-pedido")
    modal.classList.add("hidden")
}

function fazerPedido(item) {
    resultado = abrirModal(item)
    document.querySelector(".pedido-btn.cancela").addEventListener("click", function() {
        cancelarPedido(item.id)
    })
    document.querySelector(".pedido-btn.confirma").addEventListener("click", function() {
        const quantidade = document.getElementById(`qtd-${item.id}`)
        const valorTotal = document.getElementById("valorTotal")
        item['quantidade'] = Number(quantidade.innerHTML)

        valorTotal.innerHTML = Number(valorTotal.innerHTML) + item.valor * item.quantidade
        quantidade.innerHTML = 1

        alert("Pedido realizado com sucesso!")

        salvarUltimoPedido(item)
        salvarHistoricoPedidos(item)

        fecharModal()
    })
}

function cancelarPedido(id) {
    const qtdProduto = document.getElementById(`qtd-${id}`)
    qtdProduto.innerHTML = "1"

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