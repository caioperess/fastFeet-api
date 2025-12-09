import 'reflect-metadata'

import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { asClass } from 'awilix'
import { fastify } from 'fastify'
import { jwtConfig } from './config/jwt'
import { TypeOrmRecipientRepository } from './modules/recipients/infra/typeorm/repositories/typeorm-recipient-repository'
import { TypeOrmUsersRepository } from './modules/users/infra/typeorm/repositories/typeorm-users-repository'
import { initializeDataSource } from './shared/infra/database'
import { appRoutes } from './shared/infra/http/routes'

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

app.register(fastifyAwilixPlugin, {
	disposeOnClose: true,
	disposeOnResponse: true,
	strictBooleanEnforced: true,
})

diContainer.register({
	usersRepository: asClass(TypeOrmUsersRepository).singleton(),
})

diContainer.register({
	recipientsRepository: asClass(TypeOrmRecipientRepository).singleton(),
})

app.register(fastifyCookie)

app.register(appRoutes)

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
