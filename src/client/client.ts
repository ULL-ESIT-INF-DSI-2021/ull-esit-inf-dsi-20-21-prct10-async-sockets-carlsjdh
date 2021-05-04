import * as net from 'net';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {RequestType, ResponseType} from '../types';

const socket = net.connect({port: 60300});

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
        console.log(
            `${ResponseData.notes![0].body}`,
        );
      } else {
        console.log(chalk.red(`Note not found`));
      }
      break;
    default:
      break;
  }
  socket.end();
});

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
      const socket = net.connect({port: 60300});

      socket.on('data', (data) => {
        console.log(data.toString());
        socket.end();
      });

      socket.write(
          JSON.stringify(
              {
                type: 'list',
                user: `${argv.user}`,
              },
          ) + `\n`,
          // eslint-disable-next-line max-len
      );
    }
  },
});

yargs.parse();
