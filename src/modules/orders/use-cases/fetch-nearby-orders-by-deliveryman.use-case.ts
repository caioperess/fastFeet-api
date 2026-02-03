import type { DeliverymanRepository } from '@/modules/deliveryman/repositories/deliveryman-repository'
import { DeliverymanNotFoundError } from '@/modules/deliveryman/use-cases/errors/deliveryman-not-found'
import type { OrdersRepository } from '../repositories/orders-repository'

interface FetchNearbyOrdersByDeliverymanUseCaseParams {
	deliverymanId: string
	latitude: number
	longitude: number
}

export class FetchNearbyOrdersByDeliverymanUseCase {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly deliverymanRepository: DeliverymanRepository,
	) {}

	async execute({ deliverymanId, latitude, longitude }: FetchNearbyOrdersByDeliverymanUseCaseParams) {
		const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

		if (!deliveryman) {
			throw new DeliverymanNotFoundError()
		}

		const orders = await this.ordersRepository.findNearbyOrdersByDeliveryman({
			deliverymanId,
			latitude,
			longitude,
		})

		return { orders }
	}
}
