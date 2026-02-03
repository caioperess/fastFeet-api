import type { FastifyInstance } from 'fastify'
import { deliverOrderController } from '../controllers/deliveryman/deliver-order.controller'
import { withdrawnOrderController } from '../controllers/deliveryman/withdrawn-order.controller'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function deliverymanRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt)

	app.post('/deliver/:id', deliverOrderController)
	app.post('/withdrawn/:id', withdrawnOrderController)
}
