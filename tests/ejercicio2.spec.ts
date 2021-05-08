import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
// eslint-disable-next-line max-len
import {Client} from '../src/wrapper/client/classClient';
import {ResponseType} from '../src/types';

describe('MessageEventEmitterClient', () => {
  it('Clase cliente realiza peticion add correctamente', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('New note added!');
    });

    const ResponseJson :ResponseType = {
      type: 'add',
      success: true,
      notes: [],
      color: true,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });

  it('Clase cliente emite error ', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('error', (error) => {
      expect(error).to.be.eql('error del servidor');
    });

    socket.emit('error');
    done();
  });
  // eslint-disable-next-line max-len
  it('Clase cliente emite error petición por error de color add note', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Note title taken!');
    });

    const ResponseJson :ResponseType = {
      type: 'add',
      success: false,
      notes: [],
      color: true,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });

  // eslint-disable-next-line max-len
  it('Clase cliente emite error petición por error de color add note', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Problem with Color');
    });

    const ResponseJson :ResponseType = {
      type: 'add',
      success: false,
      notes: [],
      color: false,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });

  // eslint-disable-next-line max-len
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

  it('Clase cliente emite petición read note', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Note not found');
    });

    const ResponseJson :ResponseType = {
      type: 'read',
      success: false,
      notes: [

      ],
      color: false,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });
});
