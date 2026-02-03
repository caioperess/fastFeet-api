import type { FastifyInstance } from 'fastify'
import { createRecipientController, createRecipientSchema } from '../controllers/recipients/create-recipient.controller'
import { deleteRecipientController } from '../controllers/recipients/delete-recipient.controller'
import { updateRecipientController, updateRecipientSchema } from '../controllers/recipients/update-recipient.controller'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function recipientsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt)

	app.post('/', { schema: createRecipientSchema }, createRecipientController)
	app.put('/', { schema: updateRecipientSchema }, updateRecipientController)
	app.delete('/:recipientId', deleteRecipientController)
}
