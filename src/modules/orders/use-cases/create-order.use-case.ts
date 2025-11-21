import { EOrderStatusEnum } from '../enums/status-enum'
import { Order } from '../infra/typeorm/orders'
import type { OrdersRepository } from '../repositories/orders-repository'

interface ICreateOrderUseCaseParams {
	productName: string
	recipientId: string
	deliveryPhotoId: string
}

export class CreateOrderUseCase {
	constructor(private readonly ordersRepository: OrdersRepository) {}

	async execute({ productName, recipientId, deliveryPhotoId }: ICreateOrderUseCaseParams): Promise<Order> {
		const order = Order.create({
			productName,
			recipientId,
			deliveryPhotoId,
			status: EOrderStatusEnum.PENDING,
		})

		await this.ordersRepository.create(order)

		return order
	}
}
