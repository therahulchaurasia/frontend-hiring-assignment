import Hapi from 'hapi';

const server = new Hapi.Server({
  host: '127.0.0.1',
  port: '8080',
  routes: {
    cors: { origin: 'ignore' },
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
