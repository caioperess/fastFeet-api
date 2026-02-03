import { EUserRole } from '@/modules/users/enums/role-enum'
import type { FastifyTypedInstance } from '@/types/fastify'
import { authenticateController, authenticateSchema } from '../controllers/users/authenticate.controller'
import { createAdminController, createAdminSchema } from '../controllers/users/create-admin.controller'
import {
	createDeliverymanController,
	createDeliverymanSchema,
} from '../controllers/users/create-deliveryman.controller'
import { deleteUserController } from '../controllers/users/delete-user.controller'
import { updateUserController, updateUsersSchema } from '../controllers/users/update-user.controller'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function usersRoutes(app: FastifyTypedInstance) {
	app.post('/session', { schema: authenticateSchema }, authenticateController)

	app.register(async (protectedScope) => {
		protectedScope.addHook('onRequest', verifyJwt)
		protectedScope.post('/deliveryman', { schema: createDeliverymanSchema }, createDeliverymanController)

		protectedScope.post('/admin', { schema: createAdminSchema }, createAdminController)
		protectedScope.put('/user', { schema: updateUsersSchema }, updateUserController)
		protectedScope.delete(':userId', { onRequest: [verifyUserRole(EUserRole.ADMIN)] }, deleteUserController as any)
	})
}
