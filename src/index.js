const fastify = require('fastify')({logger: true});
const { routes,clientController } = require('./routes/app.routes');
const globalParameters = require('./utils/globalParameters');
require("dotenv").config();
fastify.register(require('@fastify/formbody'));


fastify.get("/",(request,reply) => {
    reply.send({hello:"world"})
})


clientController.registerParameters(globalParameters);


const start = async () => {
    await fastify.register(require("@fastify/cors"), {
        origin: "*",
        methods: ['GET', 'POST'],
        credentials: true
    })

    routes.forEach(route =>{
        fastify.route(route);
    })
    fastify.listen({port: process.env.FASTIFY_PORT | 3000},err =>{
        if(err) throw err
        console.log(`Server listening on ${fastify.server.address().port}`);
    })
}

start();