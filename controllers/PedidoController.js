const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');

class PedidoController {

    async requestCreate(req, res){
        let {data,observacao,forma_pagto,cliente_id,produtos} = req.body;
        let id = '';

        if (!data || !observacao || !forma_pagto || !cliente_id || !produtos.length > 0){
            res.status(400);
            res.send({status:false,err:"Todos os campo devem ser enviados!"});
        }
                                                      
        try {
            let cliente = await Cliente.findById(cliente_id);
            if (!cliente){
                res.status(400);
                res.send({status:false,err:"Cliente não cadastrado!"});
            }
            
            id = await Pedido.new(data,observacao,forma_pagto, cliente_id, produtos);            
        } catch (error) {            
            res.send({status:false,err:error})            
        }
        
        res.status(201);
        //res.send({status:true,msg:`Pedido cadastrado Id ${id}`});
        res.send({status:true,msg:`Pedido cadastrado Id ${id}`,_links:listLinks(id)});
    }

    async requestDetail(req, res){
        let id = req.params.id;
        let pedido = await Pedido.findById(id);        
        
        if (!pedido){
            res.status(404);
            res.json({status:false,msg:'Pedido não cadastrado!'});
            return;          
        }
        res.status(200);
        res.json({status:true,pedido,_links:listLinks(id)});
    }

    async requestList(req, res){
        let pedidos = await Pedido.findAll();
        let listaPedidos = pedidos.map(pedido =>{
                let id = pedido.id;
                return {
                    pedido,
                    _links: listLinks(id)
                }
            })
        
        res.json({listaPedidos});
    }

    async requestDelete(req, res){
        let id = req.params.id;
        let result = await Pedido.delete(id);
               
        if (!result.status){
            res.status(404);
            res.json({status:false,msg:result.err});
            return;
        }
        res.status(200);
        res.json({status:true,msg:`Pedido Id ${id} excluído!`});
    }

    async requestUpdate(req, res){
        let id = req.params.id;
        let {data,observacao,forma_pagto,cliente_id,produtos} = req.body;
        let result = await Pedido.update(id,data,observacao,forma_pagto,cliente_id,produtos);
        
        if (!result.status && result != 1){
            res.status(404);
            res.json({status:false,err:result.err});
            return;
        }
        res.status(200);
        res.send({status:true,msg:`Produto Id ${id} atualizado!`});
    }

    async requestReport(req, res){
        let id = req.params.id;
        let pedido = await Pedido.findById(id);        
        
        if (!pedido){
            res.status(404);
            res.json({status:false,msg:'Pedido não cadastrado!'});
            return;          
        }
        let cliente = await Cliente.findById(pedido.cliente_id);
        cliente.cpf = cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
        let data = new Date(pedido.data);
        data = data.getUTCDate()+'/'+(data.getUTCMonth()+1)+'/'+data.getUTCFullYear();
        pedido.data = data;
        switch(pedido.forma_pagto){
            case 1: pedido.forma_pagto='Dinehiro';break;
            case 2: pedido.forma_pagto='Cartão';break;
            case 3: pedido.forma_pagto='Cheque';break;
            default: pedido.forma_pagto='Não definido';break;
        }        
        let valorTotalPedido = pedido.produtos.reduce((acumulador, produto) => acumulador + produto.valor_total,0);
        
        ejs.renderFile("./page/pedido.ejs",{pedido,cliente,valorTotalPedido}, (error,html) =>{
            if (error){
                console.log('==> ' + error);
            } else {
                pdf.create(html,{}).toFile(`reports/${cliente.cpf}_${pedido.id}.pdf`, (err,pdf) => {
                    if (error){
                        console.log('==> ' + error);
                    }else{                        
                        res.status(200);
                        res.json({linkParaDownload:pdf})
                    }
                })
            }
        })
    }
}

function listLinks(id){
    return [
        {
            "href"   : `http://localhost:8686/pedidos/${id}`,
            "method" : "GET",
            "rel"    : "get_pedido"
        },
        {
            "href"   : `http://localhost:8686/pedidos/${id}`,
            "method" : "PUT",
            "rel"    : "update_pedido"
        },
        {
            "href"   : `http://localhost:8686/pedidos/${id}`,
            "method" : "DELETE",
            "rel"    : "delete_pedido"
        },
        {
            "href"   : `http://localhost:8686/pedidos`,
            "method" : "GET",
            "rel"    : "get_pedidos"
        }
    ]
}


module.exports = new PedidoController();