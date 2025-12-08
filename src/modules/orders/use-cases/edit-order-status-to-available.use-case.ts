import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '../enums/status-enum'
import { DeliveryEvents } from '../infra/typeorm/delivery-events'
import type { Order } from '../infra/typeorm/orders'
import type { DeliveryEventsRepository } from '../repositories/delivery-events-repository'
import type { OrdersRepository } from '../repositories/orders-repository'
import { OrderNotFoundError } from './errors/order-not-found'
import { OrderNotPendingError } from './errors/order-not-pending'

interface ChangeOrderToAvailableUseCaseParams {
	orderId: string
	userId: string
}

export class ChangeOrderToAvailableUseCase {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly deliveryEventsRepository: DeliveryEventsRepository,
	) {}

	async execute({ orderId, userId }: ChangeOrderToAvailableUseCaseParams): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId)

		if (!order) {
			throw new OrderNotFoundError()
		}

		if (order.status !== EOrderStatusEnum.PENDING) {
			throw new OrderNotPendingError()
		}

		order.status = EOrderStatusEnum.AVAILABLE

		const deliveryEvent = DeliveryEvents.create({
			orderId,
			userId,
			status: EDeliveryEventsStatusEnum.AVAILABLE,
			timestamp: new Date(),
		})

		await this.ordersRepository.save(order)
		await this.deliveryEventsRepository.create(deliveryEvent)

		return order
	}
}
