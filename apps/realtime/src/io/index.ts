import type { IOControlOptions } from '../control';
import buildEvents from './events';
import buildMiddlewares from './middlewares';
import type { AuthorizedSocket } from './types';

const buildIO = (options: IOControlOptions) => {
  const { ioServer, clients } = options;

  ioServer.adapter(clients.ioAdapter);

  const events = buildEvents(options);
  const middlewares = buildMiddlewares(options);

  ioServer.use(middlewares.auth.handle);

  ioServer.on('connection', (socket: AuthorizedSocket<any>) =>
    Object.values(events).forEach((control) =>
      socket.on(control.event, (data) => control.handle(socket, data).catch((error) => socket.emit('fatal', error)))
    )
  );
};

export default buildIO;
