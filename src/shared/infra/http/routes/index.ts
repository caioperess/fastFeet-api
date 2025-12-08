import type { FastifyInstance } from 'fastify'
import { authenticateController } from '../controllers/users/authenticate.controller'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/session', authenticateController)
}
