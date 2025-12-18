import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import { OrderNotAvailableForWithdrawnError } from '@/modules/orders/use-cases/errors/order-not-available-for-withdrawn'
import { OrderNotFoundError } from '@/modules/orders/use-cases/errors/order-not-found'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryEventsRepository } from 'test/repositories/in-memory-delivery-events.repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found'
import { WithdrawnOrderUseCase } from './withdrawn-order.use-case'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliverymanRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryEventsRepository: InMemoryDeliveryEventsRepository
let sut: WithdrawnOrderUseCase

describe('WithdrawnOrderUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryDeliverymanRepository = new InMemoryUsersRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryDeliveryEventsRepository = new InMemoryDeliveryEventsRepository()
		sut = new WithdrawnOrderUseCase(
			inMemoryDeliverymanRepository,
			inMemoryDeliveryEventsRepository,
			inMemoryOrdersRepository,
		)
	})

	it('should be able to withdraw an order', async () => {
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.AVAILABLE,
		})

		await inMemoryDeliverymanRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		await sut.execute({
			deliverymanId: deliveryman.id,
			orderId: order.id,
		})

		expect(inMemoryDeliveryEventsRepository.items).toHaveLength(1)
		expect(inMemoryDeliveryEventsRepository.items[0]).toEqual(
			expect.objectContaining({
				orderId: order.id,
				status: EOrderStatusEnum.WITHDRAWN,
				userId: deliveryman.id,
			}),
		)

		expect(inMemoryOrdersRepository.items[0].status).toBe(EOrderStatusEnum.WITHDRAWN)
		expect(inMemoryOrdersRepository.items[0].deliverymanId).toBe(deliveryman.id)
	})

	it('should not be able to withdrawn a non existing order', async () => {
		const deliveryman = makeDeliveryman()

		await inMemoryDeliverymanRepository.create(deliveryman)

		expect(() =>
			sut.execute({
				deliverymanId: deliveryman.id,
				orderId: 'fake-order-id',
			}),
		).rejects.toBeInstanceOf(OrderNotFoundError)
	})

	it('should not be able to withdrawn an order that is not available', async () => {
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.DELIVERED,
		})

		await inMemoryDeliverymanRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		expect(() =>
			sut.execute({
				deliverymanId: deliveryman.id,
				orderId: order.id,
			}),
		).rejects.toBeInstanceOf(OrderNotAvailableForWithdrawnError)
	})

	it('should not be able to withdrawn an order for a non existing deliveryman', async () => {
		const order = makeOrder({
			status: EOrderStatusEnum.AVAILABLE,
		})

		await inMemoryOrdersRepository.create(order)

		expect(() =>
			sut.execute({
				deliverymanId: 'fake-deliveryman-id',
				orderId: order.id,
			}),
		).rejects.toBeInstanceOf(DeliverymanNotFoundError)
	})
})
