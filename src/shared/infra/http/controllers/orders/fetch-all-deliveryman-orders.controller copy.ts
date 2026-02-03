import type { TypeormDeliverymanRepository } from '@/modules/deliveryman/infra/typeorm/repositories/typeorm-deliveryman-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { FetchAllDeliverymanOrderUseCase } from '@/modules/orders/use-cases/fetch-all-deliveryman-order'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const fetchAllDeliverymanOrdersSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function fetchAllOrdersByDeliverymanController(
	req: FastifyRequest<{ Params: z.infer<typeof fetchAllDeliverymanOrdersSchema> }>,
	reply: FastifyReply,
) {
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliverymanRepository = req.diScope.resolve<TypeormDeliverymanRepository>('deliverymanRepository')

	const fetchAllDeliverymanOrdersUseCase = new FetchAllDeliverymanOrderUseCase(ordersRepository, deliverymanRepository)

	const { id } = req.params

	const { orders } = await fetchAllDeliverymanOrdersUseCase.execute({
		deliverymanId: id,
	})

	return reply.status(200).send({ orders })
}
