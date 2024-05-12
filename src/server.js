const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });


    server.route(routes);

    await server.start();
    console.log(`Starting server at ${server.info.uri}`);
};

init();