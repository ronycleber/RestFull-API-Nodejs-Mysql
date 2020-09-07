const knex = require ('../database/connection');

class Produto {

    async new(nome,cor,tamanho,valor){
        console.log(nome,cor,tamanho,valor);
        try {
            return await knex.insert({nome,cor,tamanho,valor}).returning('id').table("produtos");
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async findAll(){
        try {
            return await knex.select("*").table("produtos");
        } catch (error) {            
            return {status:false,err:error};
        }
    }

    async findById(id){
        try {
            let produto =  await knex.select('*').table('produtos').where({id});
            return produto.length > 0 ? produto[0] : false;
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async delete(id){
        let produto = await this.findById(id);
        
        if (!produto){            
            return {status:false,err:'Produto não cadastrado'};
        }
        try {
            return await knex.delete().table('produtos').where({id});
        } catch (error) {
            return {status:false,err:error};
        }
    }

    async update(id,nome,cor,tamanho,valor){
        let produto = await this.findById(id);
        
        if (!produto){
            return {status:false,err:'Produto não cadastrado'};
        }
        
        let editProduto = {};
        
        if (nome){
            editProduto.nome = nome;
        }

        if (cor){
            editProduto.cor = cor;
        }
        
        if (tamanho){
            editProduto.tamanho = tamanho;
        }
        if (valor){
            editProduto.valor = valor;
        }

        try {
            return await knex.update(editProduto).table('produtos').where({id});
        } catch (error) {
            return {status:false,err:error};
        }
        
    }

}

module.exports = new Produto();