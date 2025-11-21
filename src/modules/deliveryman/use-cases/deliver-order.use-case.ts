import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import type { OrdersRepository } from '@/modules/orders/repositories/orders-repository'
import { OrderNotAvailableForDeliverError } from '@/modules/orders/use-cases/errors/order-not-available-for-deliver'
import { OrderNotFoundError } from '@/modules/orders/use-cases/errors/order-not-found'
import type { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found'

interface IDeliverOrderUseCaseParams {
	deliverymanId: string
	orderId: string
	deliveryPhotoId: string
}

export class DeliverOrderUseCase {
	constructor(
		private readonly deliverymanRepository: DeliverymanRepository,
		private readonly orderRepository: OrdersRepository,
	) {}

	async execute({ deliverymanId, orderId, deliveryPhotoId }: IDeliverOrderUseCaseParams) {
		const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

		if (!deliveryman) {
			throw new DeliverymanNotFoundError()
		}

		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			throw new OrderNotFoundError()
		}

		if (order.status !== EOrderStatusEnum.WITHDRAWN) {
			throw new OrderNotAvailableForDeliverError()
		}

		if (order.deliverymanId !== deliveryman.id) {
			throw new OrderNotAvailableForDeliverError()
		}

		order.status = EOrderStatusEnum.DELIVERED
		order.deliveryPhotoId = deliveryPhotoId

		await this.orderRepository.save(order)
	}
}
