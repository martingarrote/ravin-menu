document.addEventListener("DOMContentLoaded", function() {
    pegarDados()
})

function pegarDados() {
    const url = "data.json"
    // const url = "http://localhost:5500/ravin/server-itens.php"
    fetch(url)
        .then((dados) => {return dados.json()})
        .then((data) => {montarHtml(data)})
}

function montarHtml(dados) {
    const products = document.querySelector(".products")
    let textHtml = ""

    for (item of dados) {
        let produto = `
        <div class="product itens-menu}" data-category="${item.categoria}">
              <img src="${item.imagem}">
              <h3>${item.nome}</h3>
              <p>${item.descricao}</p>
              <button class="fazer-pedido" onclick='abrirModal(${JSON.stringify(item)})'>Pedir</button>
          </div>
        `
        textHtml += produto
    }
    products.innerHTML = textHtml
}

function preencherModal(item) {
    console.log(item)
    const modal = document.querySelector(".modal-pedido");
    let conteudoModal = `
        <div class="modal-pedido">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${item.nome}</h2>
                    <img src="${item.imagem}">
                </div>
                <div class="modal-body">
                    <p>Valor Total <br>R$ <span id="valorTotal">${item.valor}</span></p>
                    <button class="quantidade-btn" onclick="diminuirQuantidade(${item.valor})">-</button>
                    <span id="quantidade-pedido">1</span>
                    <button class="quantidade-btn" onclick="aumentarQuantidade(${item.valor})">+</button>
                </div>
                <div class="modal-footer">
                    <button class="pedido-btn" onclick="fazerPedido(${item})">Confirmar</button>
                    <button class="pedido-btn" onclick="fecharModal()">Cancelar</button>
                </div>
            </div>
        </div>      
    `
    modal.innerHTML = conteudoModal;
}

function diminuirQuantidade(preco) {
    const qtdPedido = document.getElementById("quantidade-pedido")
    const valorTotal = document.getElementById("valorTotal")
    let quantidade = Number(qtdPedido.innerHTML)
    if (quantidade > 1) {
        quantidade--
        qtdPedido.innerHTML = quantidade
    }
    valorTotal.innerHTML = quantidade * preco
}

function aumentarQuantidade(preco) {
    const qtdPedido = document.getElementById("quantidade-pedido")
    const valorTotal = document.getElementById("valorTotal")
    let quantidade = Number(qtdPedido.innerHTML)
    quantidade++
    qtdPedido.innerHTML = quantidade
    valorTotal.innerHTML = quantidade * preco
}

function abrirModal(item) {
    preencherModal(item)

    let modal = document.querySelector(".modal-pedido")
    modal.classList.remove("hidden")
}

function fecharModal() {
    const modal = document.querySelector(".modal-pedido")
    modal.classList.add("hidden")
}

function fazerPedido(item) {
    console.log(item)
    // const itensByClassName = document.getElementsByName(`qtd-${item.id}`);
    // const qtdItem = itensByClassName[0].value;
    // item['quantidade'] = qtdItem;

    // alert("Pedido feito!")

    // //enviar pedido via web -> enviar como parâmetro

    // salvarUltimoPedido(item);
    // salvarHistoricoPedidos(item);
}

function abrirPedido() {
    
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