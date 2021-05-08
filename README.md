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
## Server



Autor: Carlos Javier Delgado Hernández  
Email: alu0101016054@ull.edu.es