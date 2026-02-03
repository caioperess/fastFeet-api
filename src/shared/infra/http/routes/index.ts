import type { FastifyInstance } from 'fastify'
import { deliverymanRoutes } from './deliveryman.routes'
import { ordersRoutes } from './orders.routes'
import { recipientsRoutes } from './recipients.routes'
import { usersRoutes } from './users.routes'

export async function appRoutes(app: FastifyInstance) {
	app.register(usersRoutes, { prefix: '/users' })
	app.register(recipientsRoutes, { prefix: '/recipients' })
	app.register(deliverymanRoutes, { prefix: '/deliveryman' })
	app.register(ordersRoutes, { prefix: '/orders' })
}
