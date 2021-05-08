[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-carlsjdh/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-carlsjdh?branch=main)[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-carlsjdh/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-carlsjdh/actions/workflows/tests.yml)

<h1>Práctica 10 - Cliente y servidor para   
una aplicación de procesamiento de notas de texto</h1>

<h1>Índice:</h1>  

- [Introducción](#introducción)
- [Objetivos](#objetivos)
- [Desarrollo](#desarrollo)
  - [Types](#types)
    - [NotesJson](#notesjson)
    - [RequestType](#requesttype)
    - [ResponseType](#responsetype)
  - [Client](#client)
  - [Server](#server)
- [Extra - Wrapper:](#extra---wrapper)
  - [Clase Client EventEmitter](#clase-client-eventemitter)
- [Conclusión:](#conclusión)

# Introducción  
Implementación de la aplicación Notas desarrollada en la `Práctica 8` utilizando módulo `net` y la clase `EventEmitter` para generar eventos propios que gestionarán el comportamiento delprograma 

# Objetivos
- Aprender a desarrollar aplicaciones de caracter servidor/cliente
- Primer contacto con el módulo net
- Desarrollar clases heredadas de `EventEmitter` para obtener un amyor control de las aplicaciones `asíncronas`.  

# Desarrollo
A continuación se explicará las partes del código utilizadas:  

## Types
Este fichero contendrá los diferentes JSON que utilizaremos para el envio y respuestas de mensajes, además del JSON de la propia nota en sí. De esta forma la información enviada quedará mucho más estructurada.  

### NotesJson  

````typescript
export type NotesJson = {
  user: string;
  title: string;
  body?: string;
  color?: string;
}
````
Tipo de dato `JSON` que alamcena información respecto a una nota guardada en el sistema:
- `user`: El usuario asociado a la nota (Obligatorio)
- `title`: Título de la nota (Obligatorio)
- `body`: Contenido de la nota (No obligatorio)
- `color`: Color asociada a la nota (No obligatorio)  

### RequestType  
````typescript
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string,
  title?: string;
  body?: string;
  color?: string;
};
````  
Tipo de dato `JSON` que almacena una petición enviada al servidor acompañada de la información pertinente:
- `type`: Atributo que nos permite especificar la acción de la petición
- `user`: Usuario asociada a la petición (list)
- `title`: Título de la nota (add, read, remove)
- `body`: Contenido de la nota (add)
- `color`: Color de la nota (add)


### ResponseType  
````typescript
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  color?: boolean
  notes?: NotesJson[];
};
````
Tipo de dato `JSON` que envía la respuesta al cliente:
- `type`: Tipo de acción
- `success`: Estado de la petición
- `color`: Boolean para comprobar si el color enviado es válido
- `notes`: Array de notas


## Client
El cliente se conectará al servidor mediante el puerto 60300 `const socket = net.connect({port: 60300});` y en caso de error de conexión mostraremos un error en pantalla
````typescript
socket.on('error', () => {
  console.log(`Error with server`);
});
````
Si la conexión se ha realizado correctamente ahora solamente tendremos que mandar el `JSON` de `RequestType` con la información proporcionada a traves de `yargs` según el comando utilizado.

Por ejemplo, el comando `add` necesitamos mandar toda la información de la nota:  
````typescript
const RequestJson :RequestType = {
  type: 'add',
  user: `${argv.user}`,
  title: `${argv.title}`,
  body: `${argv.body}`,
  color: `${argv.color}`,
};

socket.write(
    JSON.stringify(RequestJson) +`\n`,
);
````
con `write` enviamos el contenido en formato `string` gracias al uso de `JSON.stringify` que nos permite transformar un `JSON` a `string` (También es necesario especificar el salto de línea para comunicar al servidor que ya hemos dejado de enviar información).  

El patrón de comportamiento se repite para cada uno de los comanods, lo interesante es realmente analizar como procesar la respuesta de la solicitud:  

````typescript
socket.on('data', (data) => {
  const ResponseData :ResponseType = JSON.parse(data.toString());
  switch (ResponseData.type) {
    case 'add':
      if ( ResponseData.success) {
        console.log(chalk.green(`New note added!`));
      } else {
        if (!ResponseData.color) {
          console.log(chalk.red(`Problem with Color`));
        } else {
          console.log(chalk.red(`Note title taken!`));
        }
      }
      break;
    case 'read':
      if ( ResponseData.success) {
        console.log(
            chalk.green(`Note ${ResponseData.notes![0].title} read correctly`),
        );
        consolelogColor(
          ResponseData.notes![0].title,
          ResponseData.notes![0].color!,
          true,
        );
        consolelogColor(
            `${ResponseData.notes![0].body}`,
            `${ResponseData.notes![0].color}`,
        );
      } else {
        console.log(chalk.red(`Note not found`));
      }
      break;
    case 'list':
      if ( ResponseData.success) {
        console.log(
            chalk.green(`Notes read correctly`),
        );
        console.log(
            chalk.white.inverse(`Your notes`),
        );
        ResponseData.notes?.forEach((Note) => {
          consolelogColor(Note.title, Note.color!);
        });
      } else {
        console.log(chalk.red(`Notes not found`));
      }
      break;
    case 'remove':
      if ( ResponseData.success) {
        console.log(
            chalk.green(`Note removed!`),
        );
      } else {
        console.log(chalk.red(`No note found`));
      }
      break;
    default:
      break;
  }
  socket.end();
});
````  

`socket.on('data', (data) => {})` queda la escucha de recibir datos por el socket pertinente y ejecutará dicho `callback` una vez detecte información.  
Se presupone que la información a recibir es un `ResponseType` que pertenece a la respuesta del servidor. Vamos a analizar la respuesta de una petición `add`:  

````typescript
switch (ResponseData.type) {
  case 'add':
    if ( ResponseData.success) {
      console.log(chalk.green(`New note added!`));
    } else {
      if (!ResponseData.color) {
        console.log(chalk.red(`Problem with Color`));
      } else {
        console.log(chalk.red(`Note title taken!`));
      }
    }
    break;
````  
En este caso deberemos filtrar el mensaje a mostrar segçun el contenido del `JSON`:
- `success = true`: La nota se ha agregado correctamente  
- `sucess = false`: Error al procesar la nota
  - `color = true`: Error al procesar la nota debido a un color incorrecto
  - `color = false`: Error al procesar la nota ya que esta se encontraba en la base de datos  

Es importante recalcar que el servidor ejecuta el evento `socket.end()` para comunicarle al servidor que ha recibido correctamente el mensaje

## Server
Creamos el server `const server = net.createServer((connection) => {})` y activamos el puerto por el cual va a escuchar `server.listen(60300, () => {})`.  

También crearemos nuestro propia clase que hereda de `EventEmitter` para gestionar nuestros propios eventos dentro del programa.  
````typescript
export class RequestEventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  };
}
````  
Esta clase simplemente se encarga de emitir el evento `request` cuando ha detectado que la petición del cliente ha sido recibida correctamente pasandole el `JSON` parseado directamente `this.emit('request', JSON.parse(message))`.

Es entonces dentro de la conexión cuando generamos esa nueva clase y cuando de detecte dicho evento procesar la petición  

````typescript
const server = net.createServer((connection) => {
  const serverEvent = new RequestEventEmitterServer(connection);
  console.log('A client has connected.');

  serverEvent.on('request', (request) => {
````  
Analizamos el tipo de request obtenida y en función a la misma invocaremos diferentes métodos del objeto de la clase `Notes`. Vamos a analizar la request `add`:  

````typescript
switch (request.type) {
      case 'add':
        const respond = notes.addNotes(
            request.user,
            request.title,
            request.body,
            request.color,
        );
        connection.write(respond);
        break;
````  

Todos los métodos de la clase `Notes` han sido modificados para devolver un `JSON` del tipo `ResponseType` facilitando enormemente la implementación: 

Clase Notes función `add`:  

````typescript
  addNotes(username :string, title :string, body :string, color :string) {
    if ( ! this.checkColor(color) ) {
      const ResponseJson :ResponseType = {
        type: 'add',
        success: false,
        color: false,
      };
      console.log('Color not available');
      return JSON.stringify(ResponseJson);
    };

    // eslint-disable-next-line max-len
    const text = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;

    if (fs.existsSync(`./notes/${username}`)) {
      if (!fs.existsSync(`./notes/${username}/${title}`)) {
        fs.writeFileSync(`./notes/${username}/${title}`, text);

        const NoteRespondJson :NotesJson = {
          user: `${username}`,
          title: `${title}`,
        };

        const ResponseJson :ResponseType = {
          type: 'add',
          success: true,
          notes: [NoteRespondJson],
          color: true,
        };

        console.log(`New note added!`);

        return JSON.stringify(ResponseJson);
      } else {
        const ResponseJson :ResponseType = {
          type: 'add',
          success: false,
          color: true,
        };

        console.log(`Note title taken!`);

        return JSON.stringify(ResponseJson);
      };
    } else {
      fs.mkdirSync(`./notes/${username}`, {recursive: true});
      fs.writeFileSync(`./notes/${username}/${title}`, text);

      const NoteRespondJson :NotesJson = {
        user: `${username}`,
        title: `${title}`,
      };

      const ResponseJson :ResponseType = {
        type: 'add',
        success: true,
        notes: [NoteRespondJson],
        color: true,
      };

      console.log(`New note added!`);

      return JSON.stringify(ResponseJson);
    }
````
Ahora simplemente con enviar la petición que nos devuelve `Notes` sería suficiente.  

# Extra - Wrapper:  
Para efectuar los test es necesario generar una clase que permita introducir un argumento `EventEmitter` que permitirá gestionar los diferentes eventos del argumento y generar nosotros unos nuevos según nos convenga.  
## Clase Client EventEmitter  
````typescript
import {EventEmitter} from 'events';
import {ResponseType} from '../../types';
import * as chalk from 'chalk';

export class Client extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    connection.on('error', () => {
      this.emit('error', 'error del servidor');
    });

    connection.on('data', (data) => {
      const ResponseData :ResponseType = JSON.parse(data.toString());
      switch (ResponseData.type) {
        case 'add':
          if ( ResponseData.success) {
            this.emit('response', `New note added!`, false);
          } else {
            if (!ResponseData.color) {
              this.emit('response', `Problem with Color`, true);
            } else {
              this.emit('response', `Note title taken!`, true);
            }
          }
          break;
        case 'read':
          if ( ResponseData.success) {
            this.emit(
                // eslint-disable-next-line max-len
                'response', `Note ${ResponseData.notes![0].title} read correctly`, true,
            );
          } else {
            console.log(chalk.red(`Note not found`));
          }
          break;
      }
    });
  }
};
````
El objetivo es separar la funcionalidad del módulo `net` del programa que gestiona los eventos. Para ellos simplemente crearemos un evento nuevo llamado `response` que contendrá la respuesta del servidor ya procesada cuando realizamos una inspección de dicho evento:  
__Código de testeo de la clase:__
````typescript

const socket = net.connect({port: 60300});
const client :Client = new Client(socket);

client.on('response', (respond, error) => {
  if (!error ) {
    console.log(chalk.green(respond));
  } else {
    console.log(chalk.red(respond));
  }
  socket.end();
});
````  

Observamos como pasamos el `Socket` que es un `EventEmitter`. Ahora tan solo analizamos el evento personalizado que hemos creado llamado `response` y posteriomente comunicamos al servidor que ya hemos procesado la solicitud `socket.end()`.  
Como he comentado anteriormente, la propia clase es posible testearla provocando los eventos que lo activan en los tests facilitando enormente sus prueba:  

````typescript
it('Clase cliente emite petición read note', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Note Note test read correctly');
    });

    const ResponseJson :ResponseType = {
      type: 'read',
      success: true,
      notes: [
        {
          user: 'Usertest',
          title: 'Note test',
          body: 'test',
          color: 'green',
        },
      ],
      color: false,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });
```` 

Como podemos observar en esta prueba, enviamos a la clase la respuesta y esta procesará la información que deberá salir en el evento `response` según los datos del `JSON` de tipo `ResponseType`.  

# Conclusión:
La implementación delprograma en sí no ha provocado dificultades, sin embargo, adaptar el código para poder ser utilizado en las pruebas de `mocha` es lo que más tiempo sin lugar a dudas ha podido llevarme. Aunque no se lograse un resultado perfecto en este apartado por cuestiones de tiempo con la implemetanción unicamente del cliente y solo parte de sus funcionalidades en lo que respecta al código adaptado a los test.