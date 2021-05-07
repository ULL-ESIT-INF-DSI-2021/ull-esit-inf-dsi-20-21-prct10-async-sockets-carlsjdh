<h1>Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto</h1>

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
## Server



Autor: Carlos Javier Delgado Hernández  
Email: alu0101016054@ull.edu.es