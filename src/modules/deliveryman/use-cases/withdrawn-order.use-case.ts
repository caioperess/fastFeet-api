import { EDeliveryEventsStatusEnum } from '@/modules/orders/enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import { DeliveryEvents } from '@/modules/orders/infra/typeorm/delivery-events'
import type { DeliveryEventsRepository } from '@/modules/orders/repositories/delivery-events-repository'
import type { OrdersRepository } from '@/modules/orders/repositories/orders-repository'
import { OrderNotAvailableForWithdrawnError } from '@/modules/orders/use-cases/errors/order-not-available-for-withdrawn'
import { OrderNotFoundError } from '@/modules/orders/use-cases/errors/order-not-found'
import type { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found'

interface WithdrawnOrderUseCaseProps {
	deliverymanId: string
	orderId: string
}

export class WithdrawnOrderUseCase {
	constructor(
		private readonly deliverymanRepository: DeliverymanRepository,
		private readonly deliveryEventsRepository: DeliveryEventsRepository,
		private readonly orderRepository: OrdersRepository,
	) {}

	async execute({ deliverymanId, orderId }: WithdrawnOrderUseCaseProps) {
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

		const deliveryEvent = DeliveryEvents.create({
			orderId: order.id,
			userId: deliverymanId,
			status: EDeliveryEventsStatusEnum.WITHDRAWN,
			timestamp: new Date(),
		})

		await this.orderRepository.save(order)
		await this.deliveryEventsRepository.create(deliveryEvent)
	}
}
