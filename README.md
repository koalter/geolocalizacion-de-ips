# Geolocalizacion de IPs

Esta aplicación web busca y encuentra información de un país y su distancia aproximada con Buenos Aires a través de la dirección IP ingresada.

## Tecnologías utilizadas
* Node.js
* Express
* EJS
* MongoDB
* Jest

## Setup
### Iniciar en un contenedor Docker
* En el directorio de la aplicacion, ejecutar la siguiente linea en una consola de comandos
```
docker-compose up
```
* Abrimos el navegador en http://localhost:3000
### Ejecutar tests unitarios
```
npm test
```

## Live preview
https://geolocalizacion-de-ips.herokuapp.com/

* Desde la seccion **Search-IP** podemos ingresar una dirección IP. Si encuentra información correspondiente a un país, devolverá la ip ingresada, el nombre del país, su clave ISO, idiomas, horas y fecha actuales, divisa (y conversión a dolares si esta disponible), y asimismo la distancia aproximada a Buenos Aires.
* Desde la sección **Queries** encontraremos funcionalidades para encontrar la distancia más larga entre las IP consultadas, distancia más corta y distancia promedio.
