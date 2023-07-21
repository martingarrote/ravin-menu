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
              <input type="number" name="qtd-${item.id}" min="0">
              <p><a class="btn" href="#" onclick='fazerPedido(${JSON.stringify(item)})'>Fazer pedido</a></p>
          </div>
        `
        textHtml += produto
    }
    products.innerHTML = textHtml
}

function selecionar(elemento) {
    elemento.classList.add("selected")
}

function fazerPedido(item) {
    const itensByClassName = document.getElementsByName(`qtd-${item.id}`);
    const qtdItem = itensByClassName[0].value;
    item['quantidade'] = qtdItem;

    alert("Pedido feito!")

    //enviar pedido via web -> enviar como parâmetro

    salvarUltimoPedido(item);
    salvarHistoricoPedidos(item);
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