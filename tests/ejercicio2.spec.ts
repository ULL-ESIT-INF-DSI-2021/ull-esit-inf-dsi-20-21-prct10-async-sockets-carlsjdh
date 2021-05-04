import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
// eslint-disable-next-line max-len
import {RequestEventEmitterServer} from '../src/server/RequestEventEmitterServer';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new RequestEventEmitterServer(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'type': 'change', 'prev': 13, 'curr': 26});
    });

    socket.emit('data', '{"type": "change", "prev": 13');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
    done();
  });
});
