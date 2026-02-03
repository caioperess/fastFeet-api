import type { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { ChangeOrderToAvailableUseCase } from '@/modules/orders/use-cases/edit-order-status-to-available.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const editOrderStatusToAvailableSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function editOrderStatusToAvailableController(
	req: FastifyRequest<{ Params: z.infer<typeof editOrderStatusToAvailableSchema> }>,
	reply: FastifyReply,
) {
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliveryEventsRepository = req.diScope.resolve<TypeormDeliveryEventsRepository>('deliveryEventsRepository')

	const changeOrderToAvailableUseCase = new ChangeOrderToAvailableUseCase(ordersRepository, deliveryEventsRepository)

	const { id } = req.params
	const userId = req.user.sub

	await changeOrderToAvailableUseCase.execute({
		orderId: id,
		userId,
	})

	return reply.status(200).send()
}
