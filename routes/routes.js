const express = require("express")
const app = express();
const router = express.Router();
const ClienteController = require("../controllers/ClienteController");
const ProdutoController = require("../controllers/ProdutoController");
const PedidoController = require("../controllers/PedidoController");

router.get('/clientes', ClienteController.customerList);
router.get('/clientes/:id', ClienteController.customerDetail);
router.post('/clientes', ClienteController.customerCreate);
router.put('/clientes/:id', ClienteController.customerUpdate);
router.delete('/clientes/:id', ClienteController.customerDelete);

router.get('/produtos', ProdutoController.productList);
router.get('/produtos/:id', ProdutoController.productDetail);
router.post('/produtos', ProdutoController.productCreate);
router.put('/produtos/:id', ProdutoController.productUpdate);
router.delete('/produtos/:id', ProdutoController.productDelete);

router.get('/pedidos', PedidoController.requestList);
router.get('/pedidos/:id', PedidoController.requestDetail);
router.post('/pedidos/:id/report', PedidoController.requestReport);
router.post('/pedidos', PedidoController.requestCreate);
router.put('/pedidos/:id', PedidoController.requestUpdate);
router.delete('/pedidos/:id', PedidoController.requestDelete);

module.exports = router;