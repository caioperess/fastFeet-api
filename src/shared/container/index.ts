import { TypeormAdminRepository } from '@/modules/admin/infra/typeorm/repositories/typeorm-admin-repository'
import { TypeormDeliverymanRepository } from '@/modules/deliveryman/infra/typeorm/repositories/typeorm-deliveryman-repository'
import { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { TypeOrmRecipientRepository } from '@/modules/recipients/infra/typeorm/repositories/typeorm-recipient-repository'
import { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'
import { diContainer } from '@fastify/awilix'
import { asClass } from 'awilix'

export function registerContainer() {
	diContainer.register({
		usersRepository: asClass(TypeOrmUsersRepository).singleton(),
	})

	diContainer.register({
		deliveryEventsRepository: asClass(TypeormDeliveryEventsRepository).singleton(),
	})

	diContainer.register({
		deliverymanRepository: asClass(TypeormDeliverymanRepository).singleton(),
	})

	diContainer.register({
		adminRepository: asClass(TypeormAdminRepository).singleton(),
	})

	diContainer.register({
		ordersRepository: asClass(TypeormOrdersRepository).singleton(),
	})

	diContainer.register({
		recipientsRepository: asClass(TypeOrmRecipientRepository).singleton(),
	})
}
