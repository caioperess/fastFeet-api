import { EOrderStatusEnum } from '../enums/status-enum'
import type { Order } from '../infra/typeorm/orders'
import type { OrdersRepository } from '../repositories/orders-repository'
import { OrderNotFoundError } from './errors/order-not-found'
import { OrderNotPendingError } from './errors/order-not-pending'

export class ChangeOrderToAvailableUseCase {
	constructor(private readonly ordersRepository: OrdersRepository) {}

	async execute({ orderId }: { orderId: string }): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId)

		if (!order) {
			throw new OrderNotFoundError()
		}

		if (order.status !== EOrderStatusEnum.PENDING) {
			throw new OrderNotPendingError()
		}

		order.status = EOrderStatusEnum.AVAILABLE

		await this.ordersRepository.save(order)

		return order
	}
}
