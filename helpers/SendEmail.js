const nodemailer = require('nodemailer');
const path = require('path'); 

class SendEmail {

    sendEmailPedido(cliente){

        //let {name, email, msg} = req.body
        //let name = 'Roni Cleber da Silva';
        //let email = 'ronycleber_pm@hotmail.com';
        //let msg = 'Tudo OK';
        let transporter = nodemailer.createTransport({
            host :'smtp.gmail.com',
            port : 587,
            secure : false,            
            auth: {
              user: 'ronycleber.dev@gmail.com',
              pass: 'sdpmtp32'
            },
        });
        
        transporter.sendMail({           
            from: 'Roni Cleber <ronycleber.dev@gmail.com>',
            to: 'ronycleber_pm@hotmail.com',
            subject: `Desafio Revelo - Envio do Pedido nº ${cliente.pedido}`,
            html: `
            <h3>Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${cliente.nome}</p>
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Mensagem:</strong> Segue em anexo seu pedido nº ${cliente.pedido}</p>`,
            replyTo: 'ronycleber.dev@gmail.com>',
            attachments: [
                {   // utf-8 string as an attachment
                    filename: `${cliente.cpf}_${pedido.id}.pdf`,
                    path: path.join(__dirname, `../reports/${filename}`) // stream this file
                }
            ]                
        }).then(message => {
            console.log(message);
            return message;
        }).catch(err => {
            console.log('==> '+ err);
            return err;
        })
    }
}

module.exports = new SendEmail();

//const email = new SendEmail();
//email.SendEmailPedido();