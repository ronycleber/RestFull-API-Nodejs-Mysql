var express = require("express")
var app = express();
var router = express.Router();
var ClienteController = require("../controllers/ClienteController");
var ProdutoController = require("../controllers/ProdutoController");

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


module.exports = router;