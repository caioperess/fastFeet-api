import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '../enums/status-enum'
import { DeliveryEvents } from '../infra/typeorm/entities/delivery-events'
import type { Order } from '../infra/typeorm/entities/orders'
import type { DeliveryEventsRepository } from '../repositories/delivery-events-repository'
import type { OrdersRepository } from '../repositories/orders-repository'
import { OrderNotDeliveredError } from './errors/order-not-delivered-error'
import { OrderNotFoundError } from './errors/order-not-found'

interface ChangeOrderToReturnedUseCaseParams {
	orderId: string
	userId: string
}

export class ChangeOrderToReturnedUseCase {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly deliveryEventsRepository: DeliveryEventsRepository,
	) {}

	async execute({ orderId, userId }: ChangeOrderToReturnedUseCaseParams): Promise<Order> {
		const order = await this.ordersRepository.findById(orderId)

		if (!order) {
			throw new OrderNotFoundError()
		}

		if (order.status !== EOrderStatusEnum.DELIVERED) {
			throw new OrderNotDeliveredError()
		}

		order.status = EOrderStatusEnum.RETURNED

		const deliveryEvent = DeliveryEvents.create({
			orderId,
			userId,
			status: EDeliveryEventsStatusEnum.RETURNED,
			timestamp: new Date(),
		})

		await this.ordersRepository.save(order)
		await this.deliveryEventsRepository.create(deliveryEvent)

		return order
	}
}
