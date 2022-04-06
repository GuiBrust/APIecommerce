const TotalCarrinho = require('../models/totalCarrinho.model.js');
const { produtosCadastrados } = require('./produto.service.js');

const mapCarrinhos = new Map() // utilizem um map de (idCarrinho, ItemCarrinho[])

function verificaValores(item) {
    if (item.codigoProduto == "") {
        return "codigoProduto"
    } else if (item.quantidade < 1) {
        return "quantidade"
    } else {
        return true
    }
}

function verificaProdutoCadastrado(produtosCadastrados, itemCarrinho) {
    let flag = true;
    produtosCadastrados.forEach(produto => {
        if (produto.codigo == itemCarrinho.codigoProduto) {
            flag = false
        }
    });
    if (flag) {
        throw new Error(`O produto não cadastrado`)
    }

}

async function incluirItemCarrinho(idCarrinho, itemCarrinho, produtosCadastrados) {
    let campo = verificaValores(itemCarrinho)

    verificaProdutoCadastrado(produtosCadastrados, itemCarrinho)

    if (campo == true) {
        var itens = mapCarrinhos.get(idCarrinho)

        if (!itens) {//caso não existir cadastra um novo
            // TODO se carrinho nao existe, entao incluir novo carrinho no mapCarrinhos
            mapCarrinhos.set(idCarrinho, [itemCarrinho])

            return itemCarrinho
        } else {
            var itens = mapCarrinhos.get(idCarrinho)

            var item = itens.find(function (item) {
                return item.codigoProduto == itemCarrinho.codigoProduto
            })

            if (item) {//verificar se produto já esta no carrinho
                // Se carrinho ja contem o item, entao adicionar a quantidade

                item.quantidade += itemCarrinho.quantidade;
                var foudnIndex = itens.findIndex(function (item) {
                    return item.codigoProduto == itemCarrinho.codigoProduto
                })
                itens[foudnIndex] = item;
                mapCarrinhos.set(idCarrinho, itens)
            }
            else {// caso contrario, inserir item no carrinho
                itens.push(itemCarrinho)
                mapCarrinhos.set(idCarrinho, itens)
            }

        }
        return itens

    } else {
        // caso nao tenha sido informado algum dos campos, entao retornar a exececao abaixo
        throw new Error(`Nenhum valor informado para o campo ${campo}`)
    }

}

async function removerItemCarrinho(idCarrinho, itemCarrinho) {

    const itens = mapCarrinhos.get(idCarrinho)

    if (itens) {
        var item = itens.find(function (item) {
            return item.codigoProduto == itemCarrinho.codigoProduto
        })
        // Diminuir a quantidade informada da quantidade do item adicionada ao carrinho
        item.quantidade -= itemCarrinho.quantidade;
        var foudnIndex = itens.findIndex(function (item) {
            return item.codigoProduto == itemCarrinho.codigoProduto
        })

        itens[foudnIndex] = item;

        // Caso a quantidade ficar zerada, entao remover item do carrinho
        if (item.quantidade <= 0) {
            itens.splice(foudnIndex, 1)
        }

        return itens
    } else {// TODO se carrinho nao existe, entao retornar o erro abaixo
        throw new Error(`Não existe nenhum carrinho com o id ${idCarrinho}`)
    }

    // Dica: para facilitar a implementação quando precisar altera um item no mapa,
    // você pode optar por remover o item e reinseri-lo com as mudanças
}

async function totalizarCarrinho(idCarrinho, formaPagamento) {

    const itens = mapCarrinhos.get(idCarrinho)
    let valor = 0, desc = 0, liquido = 0;
    if (itens) {
        // TODO Totalizar os itens do carrinho e aplicar desconto se forma de pagamento for Boleto
        var produtos = produtosCadastrados()

        for (let i = 0; i < itens.length; i++) {
            produtos.forEach(item => {
                if (item.codigo == itens[i].codigoProduto) {
                    valor += item.preco * itens[i].quantidade;
                }
            });
        };

        if (formaPagamento == "BOLETO") {
            desc = valor * 0.05; // 5% de desconto
        }

        liquido = valor - desc;

    } else {// TODO se carrinho nao existe, entao retornar o erro abaixo
        throw new Error(`Não existe nenhum carrinho com o id ${idCarrinho}`)
    }

    // Dica, ao totalizar o carrinho você deve pesquisar pelo preço na produto.service.js
    // retornar object TotalCarrinho
    return new TotalCarrinho({
        valorBruto: valor,
        desconto: desc,
        valorLiquido: liquido
    })
}

module.exports = { incluirItemCarrinho, removerItemCarrinho, totalizarCarrinho }
