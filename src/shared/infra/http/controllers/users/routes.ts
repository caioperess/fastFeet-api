import type { FastifyInstance } from 'fastify'
import { authenticateController } from './authenticate.controller'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/session', authenticateController)
}
