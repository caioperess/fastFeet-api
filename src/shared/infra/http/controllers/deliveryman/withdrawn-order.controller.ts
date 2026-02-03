import type { TypeormDeliverymanRepository } from '@/modules/deliveryman/infra/typeorm/repositories/typeorm-deliveryman-repository'
import { WithdrawnOrderUseCase } from '@/modules/deliveryman/use-cases/withdrawn-order.use-case'
import type { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const withdrawnOrderSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function withdrawnOrderController(
	req: FastifyRequest<{ Params: z.infer<typeof withdrawnOrderSchema> }>,
	reply: FastifyReply,
) {
	const deliverymanRepository = req.diScope.resolve<TypeormDeliverymanRepository>('deliverymanRepository')
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliveryEventsRepository = req.diScope.resolve<TypeormDeliveryEventsRepository>('deliveryEventsRepository')

	const withdrawnOrderUseCase = new WithdrawnOrderUseCase(
		deliverymanRepository,
		deliveryEventsRepository,
		ordersRepository,
	)

	const { id: orderId } = req.params
	const deliverymanId = req.user.sub

	await withdrawnOrderUseCase.execute({ orderId, deliverymanId })

	return reply.status(200).send()
}
