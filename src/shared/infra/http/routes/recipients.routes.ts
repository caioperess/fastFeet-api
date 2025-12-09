import type { FastifyInstance } from 'fastify'
import { createRecipientController } from '../controllers/recipients/create-recipient.controller'

export async function recipientsRoutes(app: FastifyInstance) {
	app.post('/', createRecipientController)
}
