import type { TypeormDeliverymanRepository } from '@/modules/deliveryman/infra/typeorm/repositories/typeorm-deliveryman-repository'
import type { TypeormOrdersRepository } from '@/modules/orders/infra/typeorm/repositories/typeorm-orders-repository'
import { FetchNearbyOrdersByDeliverymanUseCase } from '@/modules/orders/use-cases/fetch-nearby-orders-by-deliveryman.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const fetchNearbyOrdersByDeliverymanBodySchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
})

export const fetchNearbyOrdersByDeliverymanParamsSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
})

export async function fetchNearbyOrdersByDeliverymanController(
	req: FastifyRequest<{
		Params: z.infer<typeof fetchNearbyOrdersByDeliverymanParamsSchema>
		Body: z.infer<typeof fetchNearbyOrdersByDeliverymanBodySchema>
	}>,
	reply: FastifyReply,
) {
	const ordersRepository = req.diScope.resolve<TypeormOrdersRepository>('ordersRepository')
	const deliverymanRepository = req.diScope.resolve<TypeormDeliverymanRepository>('deliverymanRepository')

	const fetchAllDeliverymanOrdersUseCase = new FetchNearbyOrdersByDeliverymanUseCase(
		ordersRepository,
		deliverymanRepository,
	)

	const { id } = req.params
	const { latitude, longitude } = req.body

	const { orders } = await fetchAllDeliverymanOrdersUseCase.execute({
		deliverymanId: id,
		latitude,
		longitude,
	})

	return reply.status(200).send({ orders })
}
