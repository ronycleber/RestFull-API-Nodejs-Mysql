const knex = require ('../database/connection');

class Cliente {

    async new(nome,cpf,sexo,email){
        try {
            return await knex.insert({nome,cpf,sexo,email}).returning('id').table("clientes");
        } catch (error) {
            console.log(error);
        }
    }

    async findAll(){
        try {
            return await knex.select("*").table("clientes");
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findById(id){
        try {
            let cliente =  await knex.select('*').table('clientes').where({id});
            return cliente.length > 0 ? cliente[0] : undefined;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findEmail(email){        
        try {
            return (await knex.select('*').table('clientes').where({email})).length > 0 ? true:false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async findCPF(cpf){        
        try {
            return (await knex.select('*').table('clientes').where({cpf})).length > 0 ? true:false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async update(id,nome,cpf,sexo,email){
        let cliente = await this.findById(id);
        
        if (!cliente){
            return {status:false,err:'Cliente não cadastrado'};
        }

        let editCliente = {};
        
        if (email && email != cliente.email){
            
            if (await this.findEmail(email)){
                return {status:false,err:'E-mail já cadastrado!'};
            }

            editCliente.email = email;
        }

        if (nome){
            editCliente.nome = nome;
        }
        
        if (cpf && cpf != cliente.cpf){            
            if (this.findCPF(cpf) && cpf == cliente.cpf){
                return {status:false,err:'CPF já cadastrado!'};
            }
            editCliente.cpf = cpf;
        }

        if (sexo){
            editCliente.sexo = sexo;
        }
        
        try {
            return await knex.update(editCliente).table('clientes').where({id});
        } catch (error) {
            return {status:false,err:error}; 
        }

        
    }

    async delete(id){
        let cliente = await this.findById(id);
        
        if (!cliente){
            return {status:false,err:'Cliente não cadastrado'};
        }

        try {
            await knex.delete().table('clientes').where({id});
            return {status:true};
        } catch (error) {
            return {status:false};
        }
    }
}

module.exports = new Cliente();