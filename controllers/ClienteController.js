const Cliente = require ('../models/Cliente');

class ClienteController{

    async customerList(req, res){
        let clientes = await Cliente.findAll();
        let listaClientes = clientes.map(cliente => {
                let id = cliente.id;
                return {
                    cliente,
                    _links: listLinks(id)
                }
            })
        
        res.json({listaClientes});
    }

    async customerDetail(req, res){
        let id = req.params.id;
        let cliente = await Cliente.findById(id);        
        
        if (!cliente){
            res.status(404);
            res.json({msg:`Cliente Id ${id} não cadastrado!`});
            return;
        }

        res.status(200);
        res.json({cliente,_links:listLinks(id)});
    }

    async customerCreate(req, res){
        let {nome,cpf:cpf,sexo,email} = req.body;
        let id = '';

        if (!nome || !cpf || !sexo || !email){
            res.status(400);
            res.json({err:"Todos os campo devem ser enviados!"})
            return;
        }
                                                        
        try {
            cpf = cpf.replace(/\D+/g,'');
            id = await Cliente.new(nome,cpf,sexo,email);            
        } catch (error) {
            console.log(error);
        }
                
        res.status(201);
        res.json({msg:`Cliente Id ${id} cadastrado com sucesso!`,_links:listLinks(id)});
    }

    async customerUpdate(req, res){
        let id = req.params.id;
        let {nome,cpf,sexo,email} = req.body;
        let result = await Cliente.update(id,nome,cpf,sexo,email);
        
        if (!result){
            res.status(404);
            res.send(result.error);
        }

        res.status(200);
        res.send({msg:`Cliente Id ${id} atualizado!`});
    }

    async customerDelete(req, res){
        let id = req.params.id;
        let result = await Cliente.delete(id);
        
        if (!result.status){
            res.status(404);
            res.json({msg:result.err});
            return;
        }

        res.status(200);
        res.json({msg:`Cliente Id ${id} excluído!`});
    }

}


function listLinks(id){
    return [
        {
            "href"   : `http://localhost:8686/clientes/${id}`,
            "method" : "GET",
            "rel"    : "get_cliente"
        },
        {
            "href"   : `http://localhost:8686/clientes/${id}`,
            "method" : "PUT",
            "rel"    : "update_cliente"
        },
        {
            "href"   : `http://localhost:8686/clientes/${id}`,
            "method" : "DELETE",
            "rel"    : "delete_cliente"
        },
        {
            "href"   : `http://localhost:8686/clientes`,
            "method" : "GET",
            "rel"    : "get_clientes"
        }
    ]
}

module.exports = new ClienteController();