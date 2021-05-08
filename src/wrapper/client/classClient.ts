import {EventEmitter} from 'events';
import {ResponseType} from '../../types';
import * as chalk from 'chalk';
/**
 * Clase Client que gestiona eventos del cliente
 */
export class Client extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    /**
     * @description Evento error
     */
    connection.on('error', () => {
      this.emit('error', 'error del servidor');
    });
    /**
     * @description Evento para recibir la respuesta
     */
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

