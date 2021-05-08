import * as net from 'net';
import {Client} from './classClient';
import {RequestType} from '../../types';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
/**
 * @description Conexión con el servidor
 */
const socket = net.connect({port: 60300});
/**
 * @description Creación el evento Client
 */
const client :Client = new Client(socket);

/**
 * @description Evento response con la respuesta procesada
 */
client.on('response', (respond, error) => {
  if (!error ) {
    console.log(chalk.green(respond));
  } else {
    console.log(chalk.red(respond));
  }
  socket.end();
});

/**
 * @description Agregar nota
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body title',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color´s note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' &&
  typeof argv.title === 'string' &&
  typeof argv.color === 'string' &&
  typeof argv.body === 'string') {
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
    }
  },
});

/**
 * @description Leer nota
 */
yargs.command({
  command: 'read',
  describe: 'read note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const RequestJson :RequestType = {
        type: 'read',
        user: `${argv.user}`,
        title: `${argv.title}`,
      };
      socket.write(JSON.stringify(RequestJson)+`\n`);
    }
  },
});

/**
 * @description Listar notas del usuario
 */
yargs.command({
  command: 'list',
  describe: 'List notes',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const RequestJson :RequestType = {
        type: 'list',
        user: `${argv.user}`,
      };
      socket.write(JSON.stringify(RequestJson)+`\n`);
    }
  },
});
/**
 * @description Remover nota de un usuario
 */
yargs.command({
  command: 'remove',
  describe: 'Remove note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const RequestJson :RequestType = {
        type: 'remove',
        user: `${argv.user}`,
        title: `${argv.title}`,
      };
      socket.write(JSON.stringify(RequestJson)+`\n`);
    }
  },
});

yargs.parse();
