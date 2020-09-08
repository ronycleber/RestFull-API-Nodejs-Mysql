const Produto = require ('../models/Produto');

class ProdutoController {

    async productCreate(req, res){
        let {nome,cor,tamanho,valor} = req.body;
        let id = '';

        if (!nome || !cor || !tamanho || !valor){
            res.status(400);
            res.send({status:false,err:"Todos os campo devem ser enviados!"});
        }
                                                        
        try {            
            id = await Produto.new(nome,cor,tamanho,valor);            
        } catch (error) {            
            res.send({status:false,err:error})            
        }
                
        res.status(201);
        res.send({status:true,msg:`Produto cadastrado Id ${id}`,_links:listLinks(id)});
    }

    async productList(req, res){
        let produto = await Produto.findAll();
        let listaProdutos = produto.map(produto => {
                let id = produto.id;
                return {
                    produto,
                    _links: listLinks(id)
                }
            })
        
        res.json({listaProdutos});
    }

    async productDetail(req, res){
        let id = req.params.id;
        let produto = await Produto.findById(id);        
        
        if (!produto){
            res.status(404);
            res.json({status:false,msg:'Produto não cadastrado!'});
            return;          
        }
        res.status(200);
        res.json({status:true,produto,_links:listLinks(id)});
    }

    async productDelete(req, res){
        let id = req.params.id;
        let result = await Produto.delete(id);
               
        if (!result.status){
            res.status(404);
            res.json({status:false,msg:result.err});
            return;
        }
        res.status(200);
        res.json({status:true,msg:`Produto Id ${id} excluído!`});
    }

    async productUpdate(req, res){
        let id = req.params.id;
        let {nome,cor,tamanho,valor} = req.body;
        let result = await Produto.update(id,nome,cor,tamanho,valor);
        
        if (!result.status && result != 1){
            res.status(404);
            res.json({status:false,err:result.err});
            return;
        }
        res.status(200);
        res.send({status:true,msg:`Produto Id ${id} atualizado!`});
    }    
}

function listLinks(id){
    return [
        {
            "href"   : `http://localhost:8686/produtos/${id}`,
            "method" : "GET",
            "rel"    : "get_produto"
        },
        {
            "href"   : `http://localhost:8686/produtos/${id}`,
            "method" : "PUT",
            "rel"    : "update_produto"
        },
        {
            "href"   : `http://localhost:8686/produtos/${id}`,
            "method" : "DELETE",
            "rel"    : "delete_produto"
        },
        {
            "href"   : `http://localhost:8686/produtos`,
            "method" : "GET",
            "rel"    : "get_produtos"
        }
    ]
}

module.exports = new ProdutoController();