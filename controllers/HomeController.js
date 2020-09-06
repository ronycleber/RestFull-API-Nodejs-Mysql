class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Roni Cleber da Silva");
    }

}

module.exports = new HomeController();