const ClientModel = require('../models/client.model');
const MailModel = require('../models/mail.model');
const ClientController = require('../controllers/client.controller')
const clientController = new ClientController();

const routes = [
    {
        url: '/client',
        method: 'POST',
        handler:  clientController.clientAdd
    },
];

module.exports = { routes, clientController }