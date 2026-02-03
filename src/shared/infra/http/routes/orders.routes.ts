import { EUserRole } from '@/modules/users/enums/role-enum'
import type { FastifyInstance } from 'fastify'
import { createOrderController, createOrderSchema } from '../controllers/orders/create-order.controller'
import { editOrderStatusToAvailableController } from '../controllers/orders/edit-order-status-to-available.controller'
import { editOrderStatusToReturnController } from '../controllers/orders/edit-order-status-to-return.controller'
import { fetchAllOrdersByDeliverymanController } from '../controllers/orders/fetch-all-deliveryman-orders.controller copy'
import { fetchNearbyOrdersByDeliverymanController } from '../controllers/orders/fetch-nearby-deliveryman-orders.controller'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function ordersRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt)

	app.post('/', { schema: createOrderSchema }, createOrderController)
	app.patch('/change-order-to-returned/:id', editOrderStatusToReturnController)

	app.get('/deliveryman-orders/:id', fetchAllOrdersByDeliverymanController)
	app.get('/deliveryman-nearby-orders/:id', fetchNearbyOrdersByDeliverymanController)

	app.addHook('onRequest', verifyUserRole(EUserRole.ADMIN))
	app.patch('/change-order-to-available/:id', editOrderStatusToAvailableController)
}
