'use strict';

const { redisClient, verify, writeToLogs } = require('./services');

module.exports = (io) => {
  const join = (socket_id, room) => new Promise((resolve, reject) => io.of('/').adapter.remoteJoin(socket_id, room, (err) => {
    err ? reject(err) : resolve();
  }));

  const leave = (socket_id, room) => new Promise((resolve, reject) => io.of('/').adapter.remoteLeave(socket_id, room, (err) => {
    err ? reject(err) : resolve();
  }));

  io.on('connection', (socket) => {
    socket._ip = socket.client.request.headers['cf-connecting-ip'];

    const fail = () => socket.emit('fail');

    socket.on('project', (data) => {
      if (!(data.skill_id && data.auth && data.device)) return fail();
      socket.device = data.device;

      // verify the user's login token
      verify(data.auth, async (user) => {
        if (!user) return fail();
        socket.user = user.user;

        io.in(data.skill_id).clients((err, clients) => {
          if (err || clients.length === 0) {
            if (err) writeToLogs('SOCKET ROOM CHECK', err);
            socket.skill_id = data.skill_id;
            join(socket.id, data.skill_id);
            socket.emit('joined', data.skill_id);
          } else if (data.reconnect) {
            socket.skill_id = data.skill_id;
            join(socket.id, data.skill_id);
            socket.emit('conflict');
          } else {
            const client = io.sockets.connected[clients[0]];
            if (client) {
              socket.emit('occupied', {
                name: client.user.name,
                email: client.user.email,
                device: client.device,
                ip: client._ip,
              });
            } else {
              socket.emit('occupied');
            }
          }
        });
      });
    });

    socket.on('leave', () => {
      // leave all rooms the socket is connected to
      if (socket.skill_id) leave(socket.id, socket.skill_id);

      io.of('/').adapter.clientRooms(socket.id, (err, rooms) => {
        if (!err) {
          for (const room of rooms) leave(socket.id, room);
          socket.skill_id = null;
        }
      });
    });

    socket.on('disconnect', () => {
      // DEPRECATE (this is to flush out the redis server)
      if (socket.account) {
        redisClient.get(`s_${socket.account.id}`, (err, session) => {
          if (!err && session && session === socket.id) {
            redisClient.del(`s_${socket.account.id}`);
          }
        });
      }
    });
  });
};
