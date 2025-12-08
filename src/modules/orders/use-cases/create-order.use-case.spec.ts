import { InMemoryDeliveryEventsRepository } from 'test/repositories/in-memory-delivery-events.repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { EDeliveryEventsStatusEnum } from '../enums/delivery-events-status-enum'
import { CreateOrderUseCase } from './create-order.use-case'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveryEventsRepository: InMemoryDeliveryEventsRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryDeliveryEventsRepository = new InMemoryDeliveryEventsRepository()
		sut = new CreateOrderUseCase(inMemoryOrdersRepository, inMemoryDeliveryEventsRepository)
	})

	it('should be able to create an order', async () => {
		const result = await sut.execute({
			recipientId: '1',
			productName: 'fake-product',
			userId: '1',
		})

		expect(inMemoryOrdersRepository.items[0]).toEqual(result)
		expect(inMemoryDeliveryEventsRepository.items[0]).toEqual(
			expect.objectContaining({ orderId: result.id, status: EDeliveryEventsStatusEnum.CREATED }),
		)
	})
})
