const knex = require('../database/connection');
const { json } = require('body-parser');

class Pedido {

    async new(data,observacao,forma_pagto,cliente_id,produtos){

        if (!cliente_id && !produtos.length > 0){
            return {status:false,err:'Pedido requer um cliente e no mínimo um produto'};
        }
        try {          
              
            let id = await knex.insert({data,observacao,forma_pagto, cliente_id}).table("pedidos").returning('id');            
            let listaProdutos = produtos.map(produto => {
                return {
                    ...produto,                    
                    valor_total: produto.qtde * produto.valor_unid,
                    pedido_id: id[0]
                }
            })           
            console.log(listaProdutos);
            let {produto_id,qtde,valor_unid,valor_total,pedido_id} = listaProdutos;       
            if (id){
                let result = await knex.insert(listaProdutos).table("pedidos_produtos");
                console.log(result);
                return id;
            }
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async findById(id){
        try {
            
            let pedido =  await knex.select('*').table('pedidos').where({id});
            if (!pedido){
                return false;
            }

            let produtos = await knex.select(['*']).table('pedidos_produtos').innerJoin('produtos', 'pedidos_produtos.produto_id', 'produtos.id').where({pedido_id:id});
            produtos = await JSON.parse(JSON.stringify(produtos));
            
            let detalhesPedido = {
                ...pedido[0],
                produtos
            };
            
            return pedido.length > 0 ? detalhesPedido : false;
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async findAll(){
        try {
            return await knex.select("*").table("pedidos");
        } catch (error) {            
            return {status:false,err:error};
        }
    }

    async delete(id){
        let pedido = await this.findById(id);
        
        if (!pedido){            
            return {status:false,err:'Pedido não cadastrado'};
        }
        
        try {
            await knex.delete().table('pedidos').where({id});
            await knex.delete().table('pedidos_produtos').where({pedido_id:id});
            return {status:true};
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async update(id,data,observacao,forma_pagto,cliente_id,produtos){
        let pedido = await this.findById(id);

        if (!pedido){
            return {status:false,err:'Produto não cadastrado'};
        }

        if (!cliente_id && !produtos.length > 0){
            return {status:false,err:'Pedido requer um cliente e no mínimo um produto'};
        }        
        
        let editProduto = {};
        
        if (data){
            editProduto.data = data;
        }
        if (observacao){
            editProduto.observacao = observacao;
        }
        
        if (forma_pagto){
            editProduto.forma_pagto = forma_pagto;
        }
        if (cliente_id){
            editProduto.cliente_id = cliente_id;
        }

        try {
            return await knex.update(editProduto).table('pedidos').where({id});
        } catch (error) {
            return {status:false,err:error};
        }
        
    }

}

module.exports = new Pedido();