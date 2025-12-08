import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '../enums/status-enum'
import { DeliveryEvents } from '../infra/typeorm/delivery-events'
import { Order } from '../infra/typeorm/orders'
import type { DeliveryEventsRepository } from '../repositories/delivery-events-repository'
import type { OrdersRepository } from '../repositories/orders-repository'

interface ICreateOrderUseCaseParams {
	productName: string
	recipientId: string
	userId: string
}

export class CreateOrderUseCase {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly deliveryEventsRepository: DeliveryEventsRepository,
	) {}

	async execute({ productName, recipientId, userId }: ICreateOrderUseCaseParams): Promise<Order> {
		const order = Order.create({
			productName,
			recipientId,
			status: EOrderStatusEnum.PENDING,
		})

		const deliveryEvent = DeliveryEvents.create({
			status: EDeliveryEventsStatusEnum.CREATED,
			timestamp: new Date(),
			orderId: order.id,
			userId,
		})

		await this.ordersRepository.create(order)
		await this.deliveryEventsRepository.create(deliveryEvent)

		return order
	}
}
