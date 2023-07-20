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

    for (itemMenu of dados) {
        let produto = `
        <div class="product ${itemMenu}" data-category="${itemMenu.categoria}">
              <img src="${itemMenu.imagem}">
              <h3>${itemMenu.nome}</h3>
              <p>${itemMenu.descricao}</p>
              <input type="number" name="qtd-${itemMenu.id}" min="0">
              <p><a class="btn" href="#" onclick='fazerPedido(${JSON.stringify(itemMenu)})'>Fazer pedido</a></p>
          </div>
        `
        textHtml += produto
    }
    products.innerHTML = textHtml
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