import Hapi from 'hapi';

const isProduction = process.env.NODE_ENV === 'production';

const server = new Hapi.Server({
  host: isProduction ? '0.0.0.0' : 'localhost',
  port: process.env.PORT || 8080,
  routes: {
    cors: { origin: ['*'] },
  },
});

server.ext('onRequest', (request, h) => {
  console.log(`[IN] ${request.method.toUpperCase()} ${request.path}`);
  return h.continue;
});

server.events.on('response', (request) => {
  const status = request.response ? request.response.statusCode : 0;
  console.log(
    `[OUT] ${status} ${request.method.toUpperCase()} ${request.path}`,
  );
});

async function main() {
  await server.register([
    {
      plugin: require('./shifts-mock-api'),
      routes: { prefix: '/shifts' },
    },
  ]);

  await server.start();

  console.info(
    `✅  API server is listening at ${server.info.uri.toLowerCase()}`,
  );
}

main();
