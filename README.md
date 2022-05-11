# SMARTSEND - Backend do projeto Smartsend SMS

# Preparação do ambiente de desenvolvimento

Para iniciar o ambiente com docker compose, certifique-se de que possui o mesmo
instalado em sua máquina. Em seguida confira o arquivo:

```
.env.example
```

e complete as variáveis necessárias em um arquivo:

```
.env
```

Em seguida deve-se executar o script:

```
dbstart.sh
```

Após isso, o replicaset mongodb deverá estar disponível. Para conectar o ORM Prisma
com a aplicação, precisamos de uma URL válida. Atualize o seu arquivo

```
/etc/hosts
```

com os IP's dos containers e seus respectivos nomes. Para identificar o IP de cada
container no replicaset, execute o comando:

```
docker network inspect smartsim_mongo-replicaset-network
```

Por último, execute o comando

```
yarn dev
```
