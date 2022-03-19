require('dotenv').config();

const hapi = require('@hapi/hapi');

const init = async () => {
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route(routes);

  await server.start();
  console.log('app listen to port 5000');
};

init();
