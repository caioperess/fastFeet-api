import type { FastifyInstance } from 'fastify'
import { authenticateController } from '../controllers/users/authenticate.controller'
import { createAdminController } from '../controllers/users/create-admin.controller'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/session', authenticateController)
	app.post('/admin', createAdminController)
}
