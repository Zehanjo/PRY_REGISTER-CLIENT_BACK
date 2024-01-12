const { createClient } = require('redis');
require("dotenv").config();

const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT 
}

if(process.env.NODE_ENV === 'production') {
    config.username = process.env.REDIS_USERNAME;
    config.password = process.env.REDIS_PASSWORD;
}
const redisConfig = createClient(config);

console.log("redisConfig",config);

module.exports = { redisConfig };