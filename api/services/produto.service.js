const Produto = require("../models/produto.model")

const produtos = []

function verificaCodigo(produto) {
    for (var i = 0; i < produtos.length; i++) {
        if (produtos[i].codigo === produto.codigo) {
            return false;
        }
    }
    return true
}

function verificaProduto(b) {
    for (var i = 0; i < produtos.length; i++) {
        if (JSON.stringify(produtos[i]) === JSON.stringify(b)) {
            return false;
        }
    }
    return true;
}

function verificaValores(produto) {
    if (produto.codigo == "") {
        console.log(produto.codigo)
        return "Código"
    } else if (produto.nome == "") {
        return "Nome"
    } else if (produto.departamento == "") {
        return "Departamento"
    } else if (produto.preco == 0) {
        return "Preço"
    } else {
        return true
    }
}

async function cadastrarProduto(produto) {
    // TODO verificar se produto existe na lista e caso contrario inseri-lo
    if (verificaProduto(produto)) {
        let campo = verificaValores(produto)
        if (campo == true) {
            if (verificaCodigo(produto)) {
                produtos.push(produto)
                return produto
            } else {
                // TODO executar o comando abaixo, caso já exista um produto para o código informado
                throw new Error(`Já existe um produto cadastrado com o código ${produto.codigo}`)
            }
        } else {
            // TODO executar o comando abaixo, caso alguns dos campos(codigo, nome, departamento, preco) não foi informado
            throw new Error(`Nenhum valor informado para o campo ${campo}`)
        }
    } else {
        throw new Error(`Objeto já existe`)
    }
}


async function buscarProdutoPorCodigo(codigoProduto) {
    // TODO consultar produto na lista e retornar
    if (!verificaCodigo(codigoProduto)) {
        var prodCod = produtos.find(function (produto) {
            return produto.codigo == codigoProduto.codigo
        })
        return (prodCod)

    } else {
        // TODO executar o comando abaixo, caso nenhum produto seja encontrado para o código informado
        throw new Error(`Nenhum produto encontrado com o código ${codigoProduto.codigo}`)
    }
}
function produtosCadastrados(){
    return produtos.slice()
}

async function listarProdutos() {
    return produtos.slice()  
}

module.exports = { cadastrarProduto, buscarProdutoPorCodigo, listarProdutos, produtosCadastrados }