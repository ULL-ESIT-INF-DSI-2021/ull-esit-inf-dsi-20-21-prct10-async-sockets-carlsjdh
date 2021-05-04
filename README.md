[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh?branch=main) [![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh/actions/workflows/tests.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh&metric=alert_status)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh)

[Volver a Github](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh)  
[Volver al informe](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct09-async-fs-process-carlsjdh/)  

<h1> P9 - Sistema de ficheros y creación de procesos en Node.js </h1>

__Autor:__ Carlos Javier Delgado Hernandez  
__Correo:__ alu0101016054@ull.edu.es

# Indice:
- [Indice:](#indice)
- [Introducción](#introducción)
- [Objetivos](#objetivos)
- [Ejercicios](#ejercicios)
  - [Ejercicio 1](#ejercicio-1)
  - [Ejercicio 2](#ejercicio-2)
  - [Ejercicio 3](#ejercicio-3)
  - [Ejercicio 4](#ejercicio-4)
- [Conclusión](#conclusión)
- [Bibliografía](#bibliografía)

# Introducción
En esta práctica se plantean una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.
# Objetivos
- Gestionar ficheros con NodeJs  
- Creación de procesos e interconexión entre ellos con NodeJS  

# Ejercicios  

## Ejercicio 1  

Considere el siguiente ejemplo de código fuente TypeScript que hace uso del módulo fs de Node.js:  

````typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
````  

A continuación realizaremos una traza de ejecución del código anterior Teniendo en cuenta el `Call Stack`, la `Web Api` y la `Queue`. 

__Primer caso: No se introduce un fichero__  
Cuando al ejecutar el programa `process.argv.length` no es mayor que 3, eso quiere decir que no se ha especificado ningún argumento para poder establecer el fichero a observar.

Por tanto, el código se quedaría aquí:  

````typescript
console.log('Please, specify a file');
````  

E internamente quedaría así:  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  `annonymus()` | -  |  - | `Please, specify a file` |   |  

__Segundo caso: El programa funciona correctamente__  
Si se especifica el argumento que contendrá el fichero a observar entonces las líneas de código que se ejecutarán serán las siguientes:  
````typescript
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
````  
El método `access` se colocará en `Call Stack`.  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  `(err) => {}` |   |   |   |   |  
|  `access()` |   |   |   |   |  

Este al ser un método asíncrono se colocará posteriormente se colocará en `Web Api`.  

| Call Stack  |   Web Api   | Queue  |  Console |   |
|---|---|---|---|---|
|   | `(err) => {}`  |   |   |   |


Cuando `access` terminé su evento asíncrono (comprobar si existe el fichero) mandará el callback a la `Queue`.  

| Call Stack  |   Web Api   | Queue  |  Console |   |
|---|---|---|---|---|
|   |  | `(err) => {}`   |   |   |


Como la `Call Stack` se encuentra vacía los procesos de `Queue` pueden se introducidos y ejecutados en la `Call Stack`.  

Si obtuviesemos un `err`: 

| Call Stack  |   Web Api   | Queue  |  Console |   |
|---|---|---|---|---|
|  `(err) => {----}`  |  |    | `File ${filename} does not exist`  |   |


En caso contrario:  

Se muestra el mensaje de que está observando el fichero  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  `(err) => {----}`  |  |    | `Starting to watch file ${filename}`  |   |  
 

Creamos el `watcher` y activamos un evento para cuando detecte un cambio en el fichero que se quedará esperando en la `Web api` hasta detectar dicho evento y mandar la `Call Back` asociada.  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  `watcher.on('change', () => {})`  |  |    |  |   |  
|  `(err) => {----}` |   |   |   |   |  


| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|   | `() => {} (change)`  |    |  |   |  
|  `(err) => {----}` |   |   |   |   |  
 

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|    | `() => {} (change)`  |    | `File ${filename} is no longer watched` |   |  
|  `(err) => {----}` |   |   |   |   |  

Ahora se quedará el evento esperando hasta producirse un cambio:  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|    | `() => {} (change)`  |  | |   |  




Cuando se produce un cambio ocurre lo siguiente:  

| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  | `() => {} (change)`  | console.log(`File ${filename} has been modified somehow`) (Lanzado por el evento)   | |   |  


| Call Stack  |   Web Api   | Queue  |  Console |   |  
|---|---|---|---|---|  
|  | `() => {} (change)`  |   | `File ${filename} has been modified somehow` |   |  


Y así sucesivamente por cada cambio ya que el watch quedará bloquedo dentro del `Web api` por cada cambio enviando su `call back`. 

__¿Qué hace la función access? ¿Para qué sirve el objeto constants?__  
La función access nos permite obtener información de acceso sobre el fichero. El nivel de acceso que queremos saber se determina por la constante `constants` teniendo cuatro variantes:  
- `F_OK`: Comprueba si el fichero existe. Pero no comprueba sus permisos
- `R_OK`: Comprueba si el fichero puede ser leído
- `W_OK`: Comprueba si un fichero puede ser escrito
- `X_OK`: Comprueba si un fichero puede ser ejecutado  


## Ejercicio 2
En este ejercicio tendremos que desarrollar un programa que nos permita leer el número de líneas, caracteres y palabras. Utilzaremos el módulo de `yargs` para implementar dicho proposito. Este programa permitira mediante el comando `get` obtener la información previamente dicha además de un argumento `option` para establecer que información concretamente quiere el usuario. Se nos pide dos formas de hacerlo:  

- Utilizando el método `pipe`:  
  
````typescript
    fs.access(argv.file, constants.F_OK, (err) => {
      if (err) {
        console.log(`File ${argv.file} does not exist`);
      } else {
        console.log(`Great! We can execute!`);

        const cat = spawn(`cat`, [`${argv.file}`]);
        const wc = spawn('wc', [`-${argv.option}`]);
        let wcOutput = '';
        cat.stdout.pipe(wc.stdin);

        wc.stdout.on('data', (piece) => {
          wcOutput += piece;
        });

        wc.on('close', () => {
          switch (argv.option) {
            case 'l':
              console.log(
                  `${argv.file} has ${wcOutput.replace(`\n`, '')} lines`,
              );
              break;
            case 'c':
              console.log(
                  `${argv.file} has ${wcOutput.replace(`\n`, '')} characters`,
              );
              break;

            case 'w':
              console.log(
                  `${argv.file} has ${wcOutput.replace(`\n`, '')} words`,
              );
              break;

            default:
              console.log(
                  'Error, that option isnt´t available. Options = l , c , w',
              );
              break;
          }
        });
      }
    });
````  

Filtraremos los posibles errores de acceso al fichero mediante `fs.access`. Crearemos dos procesos:
- `cat`: Encargado de mostrar el contenido del fichero
- `wc`: Encargado de mostrar la información de número de líneas, palabras o caracteres. 
Ahora tan sólo sería necesario redirigir con un `pipe` la salida del `cat` al fichero hacia la entrada del proceso `wc`.  

````typescript
const cat = spawn(`cat`, [`${argv.file}`]);
const wc = spawn('wc', [`-${argv.option}`]);
let wcOutput = '';
cat.stdout.pipe(wc.stdin);
````

Ahora simplemente guardaremos la información wn wcOutput dentro del evento `data` del proceso `wc` 

````typescript
wc.stdout.on('data', (piece) => {
  wcOutput += piece;
});
````

Y finalmente, cuando el proceso termine filtraremos la información recogida según el paramatro especificado para mostrar:

````typescript
 wc.on('close', () => {
  switch (argv.option) {
    case 'l':
      console.log(
          `${argv.file} has ${wcOutput.replace(`\n`, '')} lines`,
      );
      break;
    case 'c':
      console.log(
          `${argv.file} has ${wcOutput.replace(`\n`, '')} characters`,
      );
      break;

    case 'w':
      console.log(
          `${argv.file} has ${wcOutput.replace(`\n`, '')} words`,
      );
      break;

    default:
      console.log(
          'Error, that option isnt´t available. Options = l , c , w',
      );
      break;
  }
````  
- Utilizando solamente procesos:  

El esquema sería repetir basicamente lo anterior con la pequeña modificación siguiente:  

````typescript
const wc = spawn('wc', [`-${argv.option}`, `${argv.file}`]);
let wcOutput = '';
````
Observamos como ahora `wc` es un único proceso y todo lo demás quedaría igual.  

__Ejemplo de uso:__
````bash
[~/practicas/P9(main)]$node dist/ejercicio2/appWithPipe.js get --file="helloworld.txt" --option="l"
Great! We can execute!
helloworld.txt has 3 lines
[~/practicas/P9(main)]$node dist/ejercicio2/appWithPipe.js get --file="helloworld.txt" --option="w"
Great! We can execute!
helloworld.txt has 6 words
[~/practicas/P9(main)]$node dist/ejercicio2/appWithPipe.js get --file="helloworld.txt" --option="c"
Great! We can execute!
helloworld.txt has 21 characters
[~/practicas/P9(main)]$
````

__¿Qué sucede si indica desde la línea de comandos un fichero que no existe o una opción no válida?__  
Se mostrará por consola un mensaje de error ya que gracias a la información de `err` es posible filtrar aquellos casos en los que ocurra algún error.  
````bash
[~/practicas/P9(main)]$node dist/ejercicio2/appWithPipe.js get --file="helloworl.txt" --option="c"
File helloworl.txt does not exist
[~/practicas/P9(main)]$
````

## Ejercicio 3

Desarrollar una aplicación usando el módulo `yargs` que nos permita notificar sobre modificaciones de las notas (respecto a la práctica 8) de cierto usuario concreto. Para ellos utilizaremos el módulo [`chokidar`](https://github.com/paulmillr/chokidar) que nos permitirá observar cambios de dicho directorio (Se ha sustituido por `Watchfile` de Node Js por presentar errores en duplicación de eventos en sistemas linux).  

Para observar las notas de un usuario utilizaremos el comando `watch` con el parametro `user` para especificar el usuario concreto que deseamos observar.  

````typescript
fs.access(`./notes/${argv.user}`, constants.F_OK, (err) => {
  if (err) {
    console.log(`Directory ${argv.user} does not exist`);
  } else {
    const watcher = chokidar.watch(`./notes/${argv.user}`);
    watcher.on('add', (file, _) => {
      if ( fs.existsSync(file)) {
        console.log(`${file} has been added!`);
      }
    });

    watcher.on('change', (file, _) => {
      if ( fs.existsSync(file)) {
        console.log(`${file} has been changed!`);
      }
    });

    watcher.on('unlink', (file) => {
      console.log(`${file} has been deleted!`);
    });
  }
});
````  

Nuevamente, utilizaremos `access` para verificar que el directorio existe. Posteriormente crearemos el `Watcher` hacia el directorio del usuario especificado en el argumento y filtraremos según los siguientes eventos que ocurran:
- `add`: Este evento se invoca cuando se agrega un nuevo fichero al directorio. Mostraremos el evento por consola de dicho evento

````typescript
watcher.on('add', (file, _) => {
  if ( fs.existsSync(file)) {
    console.log(`${file} has been added!`);
  }
});
````  

- `change`: Este evento se invoca cuando se agrega un nuevo fichero al directorio. Mostraremos el evento por consola de dicho evento.

````typescript
watcher.on('change', (file, _) => {
  if ( fs.existsSync(file)) {
    console.log(`${file} has been changed!`);
  }
});
````  

- `unlink`: Este evento se invoca cuando se elimina un fichero del directorio. Mostraremos el evento por consola de dicho evento.

````typescript
watcher.on('unlink', (file) => {
  console.log(`${file} has been deleted!`);
});
````  

__¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?__  
En el evento `change` y `add` del `watcher` leeríamos el fichero correspondiente que nos pasa por parametro utilizando el método `fs.readFile` que nos devuelve a su vez el contenido del fichero nuevo/modificado para mostrarlo por consola.


__¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?__  
Cambiar el ámbito del parámetro a todo el fichero que contiene todas las notas de todos los usuarios para observar todos los cambios de dicho directorio.  


__Ejemplo de uso__  
Terminal 1:  
````Bash
[~/practicas/P9(main)]$node dist/ejercicio3/watchNotes.js watch --user="Carlos"
notes/Carlos/Nota1 has been added!
notes/Carlos/Nota2 has been added!
notes/Carlos/Nota2 has been changed!
````

Terminal 2:  
````bash
[~/practicas/P9(main)]$node dist/notesApp/note-app.js add --user="Carlos" --title="Nota1" --body="Nota" --color="blue"
[~/practicas/P9(main)]$node dist/notesApp/note-app.js add --user="Carlos" --title="Nota2" --body="Nota" --color="blue"
New note added! (Title Nota2)
[~/practicas/P9(main)]$
````  

## Ejercicio 4  

Desarrollar un programa que use el módulo de `yargs` que nos permita hacer de `wrapper` enrre los diferentes comandos en Linux, concretamente los siguientes:  

__1. Dada una ruta concreta, mostrar si es un directorio o un fichero.__  
El comando para invocar este programa es `check` y deberemos pasar el argumento `path` para especificar la ruta que queremos comprobar si es un fichero o un directorio.  
Para resolver este problema, haremos uso de la función `fs.lstat` que no devolverá información de utilidad sobre la ruta establecida como parametro:  

````typescript
fs.lstat(`${argv.path}`, (err, stats) => {
  if (err) {
    console.log('Error, path doesn´t exist');
  } else {
    if (stats.isFile()) {
      console.log(`${argv.path} is a File`);
    } else {
      console.log(`${argv.path} is a Directory`);
    }
  }
});
````

Con las información de `stats` esta nos dirá si es un fichero con `isFile()` que si devuelve true mostrará que si es un fichero y si es false mostrará que es un directorio.  

__Ejemplo de uso__  

````bash
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js check --path="helloworld.txt" 
helloworld.txt is a File
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js check --path="src" 
src is a Directory
[~/practicas/P9(main)]$
````

__2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.__  
El comando para invocar dicho programa es `mkdir` cuyo parametro para ser utilizado es `path`.  
Aprovecharemos la función `fs.mkdir` para crear directorios con el `path` del argumento:  

````typescript
fs.mkdir(`${argv.path}`, {recursive: true}, (err) => {
  if (err) console.log('Error during creating directory...');
});
````  

En caso de producirse un error para crear el directorio se avisará por consola.  

__Ejemplo de uso__  

````bash
[~/practicas/P9(main)]$find dir
find: ‘dir’: No existe el archivo o el directorio
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js mkdir --path="dir" 
dir created
[~/practicas/P9(main)]$find dir
dir
[~/practicas/P9(main)]$
````

__3. Listar los ficheros dentro de un directorio.__  
El comando `list` nos permitirá listar los ficheros de un directorio pasado por el argumento `path`. En esta ocasión utilizaremos la función `fs.readdir()`:  

````typescript
fs.readdir(`${argv.path}`, (err, files) => {
  if (err) {
    console.log(`Dir ${argv.path} doesn´t exit`);
  } else {
    console.log(`List of ${argv.path}:`);
    files.forEach((file) => {
      console.log(file);
    });
  }
});
```` 
`fs.readdir()`  devolerá `files` que contiene un array de todos los nombres de los ficheros de dicho directorio, razón por la cual se efectúa un `forEach` para mostrar por consola cada `file`.  


__Ejemplo de uso__  

````bash
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js list --path="src" 
List of src:
ejercicio1
ejercicio2
ejercicio3
ejercicio4
notesApp
[~/practicas/P9(main)]$ls src/
ejercicio1  ejercicio2  ejercicio3  ejercicio4  notesApp
[~/practicas/P9(main)]$
````

__4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat)__  
Para invocar este comando usaremos `cat` y como argumento `path` para especificar el fichero que queremos visualizar:  

````typescript
fs.readFile(`${argv.path}`, (err, data) => {
  if (err) {
    console.log(`Can´t read First Note`);
  } else {
    console.log(data.toString());
  }
});
````  

Usaremos `fs.readFile` que simplemente lee el fichero de la ruta `path` y posteriomente mostramos por consola a traves del tipo de dato `buffer` que contiene `data`.  

__Ejemplo de uso__  

````bash
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js cat --path="helloworld.txt" 
Line 1
Line 2
Line 3

[~/practicas/P9(main)]$cat helloworld.txt 
Line 1
Line 2
Line 3
[~/practicas/P9(main)]$

````

__5. Borrar ficheros y directorios.__  
Utilizaremos el comando `rm` y el argumento `path` para eliminar ficheros o directorios con nuestro programa. En esta ocasión utilizaremos la función `fs.stats` para verificar si el `path` es un fichero o directorio para mostrar por consola la información adecuada, además de utilizar el módulo `rimraf` para efectuar la eliminación de dichos datos:  

````typescript
fs.lstat(`${argv.path}`, (err, stats) => {
  if (err) {
    console.log('Error, path doesn´t exist');
  } else {
    if (stats.isFile()) {
      fs.rm(`${argv.path}`, (err) => {
        if (err) {
          console.log(`Error deleting file`);
        } else {
          console.log(`Deleted file ${argv.path}`);
        }
      });
    } else {
      rimraf(`${argv.path}`, (err) => {
        if (err) {
          console.log(`Error directory file`);
        } else {
          console.log(`Deleted directory ${argv.path}`);
        }
      });
    }
  }
});
````
Podemos observar como también filtramos los errores en caso de producirse alguno durante la eliminación. 

__Ejemplo de uso__  

````bash
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js rm --path="dir" 
Deleted directory dir
[~/practicas/P9(main)]$find dir
find: ‘dir’: No existe el archivo o el directorio
[~/practicas/P9(main)]$
````



__6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.__  

Para ejecutar este comando tenemos dos opciones:
- `cp`: Permite copiar ficheros o directorios especificando los argumentos `oldPath` (Ruta origen) y `newPath` (Nueva ruta donde copiar el fichero/directorio).  

````typescript
fsExtra.copy(`${argv.oldPath}`, `${argv.newPath}`, (err) => {
  if (err) return console.error(err);
  console.log('Copy Success!');
});
````
En esta ocasión se ha optado por utilizar el módulo `fs-extra` que nos permite agregar más funcionalides al fs orignal de node js, concretamente `fsExtra.copy()` que nos permitirá copiar fichero o directorios según las rutas especficidas como argumentos. Filtraremos los errores y mostremos por consola si todo ha salido correctamente.  

- `mv`: Permite mover ficheros o directorios especificando los argumentos `oldPath` (Ruta origen) y `newPath` (Nueva ruta donde copiar el fichero/directorio).  

````typescript
fsExtra.move(`${argv.oldPath}`, `${argv.newPath}`, (err) => {
  if (err) return console.error(err);
  console.log('Move success!');
});
````  

En esta ocasión, nuevamente se ha utilizado funciones del módulo de `fs-extra` cogiendo `fsExtra.move` que permite mover ficheros/directorios especificando las rutas correspondientes.  

__Ejemplo de uso__  
````bash
[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js cp --oldPath="helloworld.txt" --newPath="newFile.txt"
Copy Success!
[~/practicas/P9(main)]$cat helloworld.txt 
Line 1
Line 2
Line 3
[~/practicas/P9(main)]$cat newFile.txt 
Line 1
Line 2
Line 3
[~/practicas/P9(main)]$

[~/practicas/P9(main)]$node dist/ejercicio4/wrapper.js mv --oldPath="helloworld.txt" --newPath="src/newFile.txt"
Move success!
[~/practicas/P9(main)]$ls src/
ejercicio1  ejercicio2  ejercicio3  ejercicio4  newFile.txt  notesApp
[~/practicas/P9(main)]$
````

# Conclusión  
En esta practica he podido aprender a utilizar Node Js para gestionar el apartado de sistema de ficheros aunque se han encontrado dificultades para realizar ciertos test (Dada la naturaleza asíncrona de ciertos comportamientos del programa) además de tener un problema muy serio con `sonarcloud` dado que no fue posible eliminar el problema de duplicación de código y por tanto nunca obtener el `pass` (Esto es debido a que se repite dentro del módulo `yargs` el `command` para cada comando generando código duplicado).  

# Bibliografía

https://nodejs.org/api/fs.html#fs_file_access_constants  
https://ull-esit-inf-dsi-2021.github.io/prct09-async-fs-process/  
https://dev.to/shadowtime2000/testing-command-line-tools-47bk  
https://coursesweb.net/nodejs/move-copy-directory  
https://github.com/paulmillr/chokidar  

