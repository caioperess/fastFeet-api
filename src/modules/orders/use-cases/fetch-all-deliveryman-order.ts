import type { DeliverymanRepository } from '@/modules/deliveryman/repositories/deliveryman-repository'
import { DeliverymanNotFoundError } from '@/modules/deliveryman/use-cases/errors/deliveryman-not-found'
import type { OrdersRepository } from '../repositories/orders-repository'

export class FetchAllDeliverymanOrderUseCase {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly deliverymanRepository: DeliverymanRepository,
	) {}

	async execute({ deliverymanId }: { deliverymanId: string }) {
		const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

		if (!deliveryman) {
			throw new DeliverymanNotFoundError()
		}

		const orders = await this.ordersRepository.findByDeliverymanId(deliverymanId)

		return orders
	}
}
