import type { TypeormDeliveryEventsRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-delivery-events-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { CreateOrderUseCase } from '@/modules/orders/use-cases/create-order.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const createOrderSchema = z.object({
	productName: z.string().nonempty('Field required!'),
	recipientId: z.uuid().nonempty('Field required!'),
})

export async function createOrderController(
	req: FastifyRequest<{ Body: z.infer<typeof createOrderSchema> }>,
	reply: FastifyReply,
) {
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliveryEventsRepository = req.diScope.resolve<TypeormDeliveryEventsRepository>('deliveryEventsRepository')

	const createOrderUseCase = new CreateOrderUseCase(ordersRepository, deliveryEventsRepository)

	const { productName, recipientId } = req.body
	const userId = req.user.sub

	await createOrderUseCase.execute({
		productName,
		recipientId,
		userId,
	})

	return reply.status(201).send()
}
