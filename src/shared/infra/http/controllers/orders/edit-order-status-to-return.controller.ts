import type { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { ChangeOrderToReturnedUseCase } from '@/modules/orders/use-cases/edit-order-status-to-return.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const editOrderStatusToReturnSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function editOrderStatusToReturnController(
	req: FastifyRequest<{ Params: z.infer<typeof editOrderStatusToReturnSchema> }>,
	reply: FastifyReply,
) {
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliveryEventsRepository = req.diScope.resolve<TypeormDeliveryEventsRepository>('deliveryEventsRepository')

	const changeOrderToReturnUseCase = new ChangeOrderToReturnedUseCase(ordersRepository, deliveryEventsRepository)

	const { id } = req.params
	const userId = req.user.sub

	await changeOrderToReturnUseCase.execute({
		orderId: id,
		userId,
	})

	return reply.status(200).send()
}
