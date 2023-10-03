let io;

module.exports = {
  unit: httpServer => {
    io = require('socket.io')(httpServer, {
      cors: {
        // origin: (origin, cb) => cb(null, true),
        origin: [process.env.ADMIN_HOSTNAME, process.env.CLIENT_HOSTNAME],
        credentials: true,
      },
    });
    return io;
  },

  getIo: () => {
    if (!io) {
      throw new Error('Secket.io not initialized!');
    }

    return io;
  },
};
