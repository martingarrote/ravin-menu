document.addEventListener("DOMContentLoaded", function() {
    pegarDados()
    atualizarValorTotal()
    atualizarStatusUltimoPedido()
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

    document.querySelector(".pedido-btn.cancela").addEventListener("click", () => {
        interromperPedido(item.id)
    })

    document.querySelector(".pedido-btn.confirma").addEventListener("click", () => {
        const quantidade = document.getElementById("quantidadePedido")
        const data = new Date()
        
        item['quantidade'] = Number(quantidade.innerHTML)
        item['horario'] = data.getHours().toString().padStart(2, '0') + ":" + data.getMinutes().toString().padStart(2, '0')
        item['status'] = "pendente"

        quantidade.innerHTML = 1

        salvarUltimoPedido(item)
        salvarHistoricoPedidos(item)
        atualizarValorTotal()

        atualizarStatusUltimoPedido()
        
        fecharModal()
        abrirModalMensagem("Pedido realizado com sucesso!", 5)
    })
}

function interromperPedido() {
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
        <tr id="pedido-${pedidos.indexOf(p)}" onclick="verPedido(this)">
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>${p.horario}</td>
            <td><div class="cell ${p.status}">${p.status}</div></td>
            <td>R$ ${(p.valor * p.quantidade).toFixed(2)}</td>
            </tr>
            `
    }

    listaHistoricoPedidos += `
    <tr>
        <td>TOTAL</td>
        <td></td>
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
        abrirModalMensagem("Você não efetuou nenhum pedido ainda.", 6)
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

function abrirModalMensagem(mensagem, tempo) {
    const modal = document.getElementById("modal-mensagem")
    const barra = document.getElementsByClassName("barra")[0]
    const localMensagem = document.getElementById("mensagem")
    
    barra.style.animation = `desaparecer ${tempo}s linear forwards`
    localMensagem.innerHTML = mensagem

    if (modal.classList.contains("hidden")) {
        modal.classList.remove("hidden")
    } else {
        modal.classList.add("hidden")
        setTimeout(() => {
            barra.style.animation = `desaparecer ${tempo}s linear forwards`
            modal.classList.remove("hidden")
        }, 100);
    }
    
    barra.addEventListener("animationend", () => {
        modal.classList.add("hidden")
    })
}

const modalList = document.querySelectorAll(".modal");
modalList.forEach((modal) => {
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            fecharModal()
        }
    })
})

function trocarStatus() {
    const statusUltimoPedido = JSON.parse(localStorage.getItem("lastOrder")).status

    const statusBall = document.getElementById("status-ball")
    const statusPedido = document.getElementById("status-pedido")

    switch (statusUltimoPedido.toUpperCase()) {
        case "ENTREGUE":
            statusBall.classList.remove(statusBall.classList[1])
            statusBall.classList.add("entregue")
            statusPedido.innerHTML = "Entregue"
            break;
    
        case "PENDENTE":
            statusBall.classList.remove(statusBall.classList[1])
            statusBall.classList.add("pendente")
            statusPedido.innerHTML = "Pendente"
            break;
    
        case "CANCELADO":
            statusBall.classList.remove(statusBall.classList[1])
            statusBall.classList.add("cancelado")
            statusPedido.innerHTML = "Cancelado"
            break;
    }    
}

function atualizarStatusUltimoPedido() {
    const ultimoPedido = JSON.parse(localStorage.getItem("lastOrder"))
    const statusUltimoPedido = document.getElementsByClassName("ultimo-pedido")[0]
    if (ultimoPedido === null || ultimoPedido === undefined) {
        statusUltimoPedido.classList.add("hidden")
    } else {
        console.log(statusUltimoPedido.classList)
        statusUltimoPedido.classList.remove("hidden")
        trocarStatus()
    }
}