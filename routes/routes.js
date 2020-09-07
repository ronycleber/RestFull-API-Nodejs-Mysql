var express = require("express")
var app = express();
var router = express.Router();
var ClienteController = require("../controllers/ClienteController");

router.get('/clientes', ClienteController.customerList);
router.get('/clientes/:id', ClienteController.customerDetail);
router.post('/clientes', ClienteController.customerCreate);
router.put('/clientes/:id', ClienteController.customerUpdate);
router.delete('/clientes/:id', ClienteController.customerDelete);



module.exports = router;