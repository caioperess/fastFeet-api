import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import type { OrdersRepository } from '@/modules/orders/repositories/orders-repository'
import { OrderNotAvailableForWithdrawnError } from '@/modules/orders/use-cases/errors/order-not-available-for-withdrawn'
import { OrderNotFoundError } from '@/modules/orders/use-cases/errors/order-not-found'
import type { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found'

export class WithdrawnOrderUseCase {
	constructor(
		private readonly deliverymanRepository: DeliverymanRepository,
		private readonly orderRepository: OrdersRepository,
	) {}

	async execute({ deliverymanId, orderId }: { deliverymanId: string; orderId: string }) {
		const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

		if (!deliveryman) {
			throw new DeliverymanNotFoundError()
		}

		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			throw new OrderNotFoundError()
		}

		if (order.status !== EOrderStatusEnum.AVAILABLE) {
			throw new OrderNotAvailableForWithdrawnError()
		}

		order.status = EOrderStatusEnum.WITHDRAWN
		order.deliverymanId = deliverymanId
		await this.orderRepository.save(order)
	}
}
