import type { FastifyInstance } from 'fastify'
import { recipientsRoutes } from './recipients.routes'
import { usersRoutes } from './users.routes'

export async function appRoutes(app: FastifyInstance) {
	app.register(usersRoutes, { prefix: '/users' })
	app.register(recipientsRoutes, { prefix: '/recipients' })
}
