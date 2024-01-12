const { redisConfig } = require('../config/redis.connection')
const { mysqlConfig } = require('../config/mysql.connection')
const axios = require('axios');
const amqp = require('amqplib');

const ClientModel = require('../models/client.model');
class ClientController {
    constructor(){
        this.connect();
    }
    
    async connect(){
        await redisConfig.connect();
    }

    async clientAdd(req,reply){
        const { token , ...clientData } = req.body;
        console.log("query",req.body);
        const isTokenValid = await validateToken(token);
        console.log("istoken valid" , isTokenValid);
        if (!isTokenValid) {
            reply.send({ success: false, message: 'Invalid token'});
        }
        const newClient = new ClientModel(clientData);
        const SQL = `CALL sp_addClient(?,?,?,?,?,?);`;
        const response = await mysqlConfig.query(SQL,[newClient.name,newClient.lastname,newClient.mail,newClient.phone,newClient.dni_ruc ?? "",newClient.address]);
        if(response[0].affectedRows === 1){
            await redisConfig.set(`user:${response[0].insertId}`, JSON.stringify(newClient));
            const clientData = await redisConfig.get(`global_parameters`);
            const client = JSON.parse(clientData);
            const enableSentEmail = client.enableEmails;
            if (client.enableEmails) await publishMessageRabbitMQ(JSON.stringify(newClient));

            console.log("enableSentEmail",enableSentEmail);
            reply.send({success:true,message:"User successfully created"});
        }else{
            reply.status(500).send({ success: false, message: 'Error to register user in BD' });
        }
    }

    registerParameters(parameters){
        redisConfig.set('global_parameters', JSON.stringify(parameters),(err,reply)=>{
           if(err){
            console.error('Error when registering parameters in Redis: ',err);
           } else {
            console.log('Register parameters successfully in Redis: ', parameters);
           }
        })
    }
}

async function publishMessageRabbitMQ(mensaje) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'microservice_mail';

        await channel.assertExchange(exchange, 'direct', { durable: false });

        channel.publish(exchange, 'sentMail', Buffer.from(JSON.stringify(mensaje)));

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Err post message in RabbitMQ:', error);
    }
}

async function validateToken(token) {
    console.log("function VALIDATE TOKEN: ");
    try {
      const response = await axios.post('http://localhost:3001/validate-token', { token });
      console.log("response validate: ",response.data.valido);
      return response.data.valido;
    } catch (error) {
      console.error('Error validating token:', error.message);
      return false;
    }
}

module.exports = ClientController;