import type { TypeormDeliverymanRepository } from '@/modules/deliveryman/infra/typeorm/repositories/typeorm-deliveryman-repository'
import { DeliverOrderUseCase } from '@/modules/deliveryman/use-cases/deliver-order.use-case'
import type { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const deliverOrderSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function deliverOrderController(
	req: FastifyRequest<{ Params: z.infer<typeof deliverOrderSchema> }>,
	reply: FastifyReply,
) {
	const deliverymanRepository = req.diScope.resolve<TypeormDeliverymanRepository>('deliverymanRepository')
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliveryEventsRepository = req.diScope.resolve<TypeormDeliveryEventsRepository>('deliveryEventsRepository')

	const deliverOrderUseCase = new DeliverOrderUseCase(deliverymanRepository, deliveryEventsRepository, ordersRepository)

	const { id: orderId } = req.params
	const deliverymanId = req.user.sub

	await deliverOrderUseCase.execute({ orderId, deliverymanId, deliveryPhotoId: 'dummy-photo-id' })

	return reply.status(200).send()
}
