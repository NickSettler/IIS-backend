# Project setup

## Environmental variables

File `.env.template` contains all environmental variables that are used in the project. You should copy it to `.env` and
fill with your values.

```bash
cp .env.template .env
```

## Docker

You should have installed docker and docker-compose on your system.

To start the project run:

```bash
docker-compose up -d
```

In case new packages were added to the project, you should rebuild the container:

```bash
docker-compose up -d --build
```

### Monitoring

You can monitor container status using WebStorm built-in docker plugin

`View -> Tool Windows -> Services`

Also, you can use docker-compose commands:

**Show containers status:**
```bash
docker-compose ps
```

**Show containers logs:**
```bash
docker-compose logs -f
```

**Stop containers:**
```bash
docker-compose down
```
