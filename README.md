NODE_ENV=

# Variables de entorno a configurar

En el archivo **application.yaml**:

NODE_ENV=(development,production)
```
NODE_ENV=

FASTIFY_PORT = 

# Cloud
REDIS_HOST=
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_PORT=

#MySQL
MYSQL_PORT=
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
```

# Ejecutar Contenedor de Redis usando Docker

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis:latest
```