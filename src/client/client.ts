import * as net from 'net';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {RequestType, ResponseType} from '../types';

/**
 * Función que muestra el color pasado por parametro
 * @param text Texto a imprimir
 * @param color Color
 * @param inverse Inverso del color
 */
function consolelogColor(
    text :string, color :string, inverse :boolean = false,
) {
  switch (color) {
    case 'blue':
      console.log(
        (inverse) ? chalk.blue.inverse(text) : chalk.blue(text),
      );
      break;
    case 'yellow':
      console.log(
        (inverse) ? chalk.yellow.inverse(text) : chalk.yellow(text),
      );
      break;
    case 'red':
      console.log(
        (inverse) ? chalk.red.inverse(text) : chalk.red(text),
      );
      break;
    case 'green':
      console.log(
        (inverse) ? chalk.green.inverse(text) : chalk.green(text),
      );
      break;
  }
}

/**
 * @description Establecemos la conexión al servidor por el puerto 60300
 */
const socket = net.connect({port: 60300});
socket.on('error', () => {
  console.log(`Error with server`);
});

/**
 * @description Procesamos los datos a recibir que es la respuesta del servidor
 */
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

/**
 * @description Añadir nota
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
 * @description Listar nota de un usuario
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
