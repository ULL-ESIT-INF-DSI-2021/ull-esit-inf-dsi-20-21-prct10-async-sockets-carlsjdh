import {Notes} from './notes';
import * as net from 'net';

import {RequestEventEmitterServer} from './RequestEventEmitterServer';
const notes :Notes = Notes.getNotes();
/**
 * @description Creamos el servidor
 */
const server = net.createServer((connection) => {
  const serverEvent = new RequestEventEmitterServer(connection);
  console.log('A client has connected.');
  /**
   * @description Procesamos la respuesta
   */
  serverEvent.on('request', (request) => {
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
      case 'list':
        connection.write(notes.listNotes(
            request.user,
        ));
        break;
      case 'read':
        connection.write(notes.readNotes(
            request.user,
            request.title,
        ));
        break;
      case 'remove':
        connection.write(notes.removeNote(
            request.user,
            request.title,
        ));
        break;
      default:
        connection.write(notes.listNotes(
            request.user,
        ));
        break;
    }
  });
  /**
   * @description Procesamos la finalización de conexión
   */
  connection.on('close', () => {
    console.log('A client has disconnected');
  });
});
/**
 * @description Escuchamos por el puerto 60300
 */
server.listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
