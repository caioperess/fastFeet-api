import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryEventsRepository } from 'test/repositories/in-memory-delivery-events.repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '../enums/status-enum'
import { ChangeOrderToReturnedUseCase } from './edit-order-status-to-return.use-case'
import { OrderNotDeliveredError } from './errors/order-not-delivered-error'
import { OrderNotFoundError } from './errors/order-not-found'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveryEventsRepository: InMemoryDeliveryEventsRepository
let sut: ChangeOrderToReturnedUseCase

describe('ChangeOrderToReturnedUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryDeliveryEventsRepository = new InMemoryDeliveryEventsRepository()
		sut = new ChangeOrderToReturnedUseCase(inMemoryOrdersRepository, inMemoryDeliveryEventsRepository)
	})

	it('should be able to update order status to RETURNED', async () => {
		const order = makeOrder({ status: EOrderStatusEnum.DELIVERED })

		await inMemoryOrdersRepository.create(order)

		await sut.execute({ orderId: order.id, userId: 'user-1' })

		expect(inMemoryOrdersRepository.items[0].status).toEqual(EOrderStatusEnum.RETURNED)
		expect(inMemoryDeliveryEventsRepository.items[0]).toEqual(
			expect.objectContaining({ orderId: order.id, status: EDeliveryEventsStatusEnum.RETURNED }),
		)
	})

	it('should not be able to update order status to RETURNED if order does not exist', async () => {
		await expect(sut.execute({ orderId: 'order-1', userId: 'user-1' })).rejects.toBeInstanceOf(OrderNotFoundError)
	})

	it('should not be able to update order status to RETURNED if order status !== DELIVERED', async () => {
		const order = makeOrder({ status: EOrderStatusEnum.WITHDRAWN })

		await inMemoryOrdersRepository.create(order)

		await expect(sut.execute({ orderId: order.id, userId: 'user-1' })).rejects.toBeInstanceOf(OrderNotDeliveredError)
	})
})
