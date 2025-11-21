import type { Order } from '../infra/typeorm/orders'
import type { OrdersRepository } from '../repositories/orders-repository'

export class FetchNearbyOrdersByDeliverymanUseCase {
	constructor(private readonly ordersRepository: OrdersRepository) {}

	async execute({ deliverymanId }: { deliverymanId: string }): Promise<Order[]> {
		const deliveryman = await this.ordersRepository.findByDeliverymanId(deliverymanId)

		if (!deliveryman) {
			throw new Error('Deliveryman not found')
		}

		const orders = await this.ordersRepository.findNearbyOrdersByDeliveryman(deliverymanId)

		return orders
	}
}
