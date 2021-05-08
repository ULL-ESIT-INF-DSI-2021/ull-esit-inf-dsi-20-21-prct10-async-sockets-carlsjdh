import * as net from 'net';
import {Client} from './classClient';
import {RequestType} from '../../types';
import * as chalk from 'chalk';
import * as yargs from 'yargs';

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
      const RequestJson :RequestType = {
        type: 'list',
        user: `${argv.user}`,
      };
      socket.write(JSON.stringify(RequestJson)+`\n`);
    }
  },
});

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
