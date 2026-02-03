import 'reflect-metadata'

import { fastifyAwilixPlugin } from '@fastify/awilix'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { jwtConfig } from './config/jwt'
import { env } from './env'
import { registerContainer } from './shared/container'
import { initializeDataSource } from './shared/infra/database'
import { appRoutes } from './shared/infra/http/routes'

initializeDataSource()

const app = fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>()

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

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCookie)

app.register(registerContainer)

app.register(fastifyCors, { origin: true, credentials: true })

app.register(appRoutes)

app.setErrorHandler((err, req, reply) => {
	if (hasZodFastifySchemaValidationErrors(err)) {
		return reply.code(400).send({
			error: 'Validation Error',
			message: "Request doesn't match the schema",
			statusCode: 400,
			details: {
				issues: err.validation,
				method: req.method,
				url: req.url,
			},
		})
	}

	if (isResponseSerializationError(err)) {
		return reply.code(500).send({
			error: 'Internal Server Error',
			message: "Response doesn't match the schema",
			statusCode: 500,
			details: {
				issues: err.cause.issues,
				method: err.method,
				url: err.url,
			},
		})
	}

	if (env.NODE_ENV !== 'production') {
		console.error(err)
	}

	return reply.status(500).send({
		message: err.message ?? 'Internal server error.',
	})
})

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
