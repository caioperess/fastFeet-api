import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryEventsRepository } from 'test/repositories/in-memory-delivery-events.repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { EOrderStatusEnum } from '../enums/status-enum'
import { ChangeOrderToAvailableUseCase } from './edit-order-status-to-available.use-case'
import { OrderNotFoundError } from './errors/order-not-found'
import { OrderNotPendingError } from './errors/order-not-pending'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveryEventsRepository: InMemoryDeliveryEventsRepository
let sut: ChangeOrderToAvailableUseCase

describe('Edit Order Status To Available', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryDeliveryEventsRepository = new InMemoryDeliveryEventsRepository()
		sut = new ChangeOrderToAvailableUseCase(inMemoryOrdersRepository, inMemoryDeliveryEventsRepository)
	})

	it('should be able to update order status to AVAILABLE', async () => {
		const order = makeOrder()

		await inMemoryOrdersRepository.create(order)

		await sut.execute({ orderId: order.id, userId: 'user-1' })

		expect(inMemoryOrdersRepository.items[0].status).toEqual(EOrderStatusEnum.AVAILABLE)
		expect(inMemoryDeliveryEventsRepository.items[0]).toEqual(
			expect.objectContaining({ orderId: order.id, status: EDeliveryEventsStatusEnum.AVAILABLE }),
		)
	})

	it('should not be able to update order status to AVAILABLE if order does not exist', async () => {
		await expect(sut.execute({ orderId: 'order-1', userId: 'user-1' })).rejects.toBeInstanceOf(OrderNotFoundError)
	})

	it('should not be able to update order status to AVAILABLE if order status !== PENDING', async () => {
		const order = makeOrder({ status: EOrderStatusEnum.WITHDRAWN })

		await inMemoryOrdersRepository.create(order)

		await expect(sut.execute({ orderId: order.id, userId: 'user-1' })).rejects.toBeInstanceOf(OrderNotPendingError)
	})
})
