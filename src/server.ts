import 'reflect-metadata'

import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import { jwtConfig } from './config/jwt'
import { initializeDataSource } from './shared/infra/database'

initializeDataSource()

const app = fastify({
	logger: true,
})

app.register(fastifyJwt, {
	secret: jwtConfig.secret,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: { expiresIn: jwtConfig.expirationTime },
})

app.register(fastifyCookie)

app.listen(
	{
		port: 3333,
	},
	(err, addr) => {
		if (err) {
			app.log.error(err)
			process.exit(1)
		}

		app.log.info(`Server listening at ${addr}`)
	},
)
