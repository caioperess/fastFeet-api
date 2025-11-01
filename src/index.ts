import Fastify from 'fastify';

const app = Fastify({
	logger: true,
});

app.listen(
	{
		port: 3333,
	},
	(err, addr) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}

		app.log.info(`Server listening at ${addr}`);
	},
);
