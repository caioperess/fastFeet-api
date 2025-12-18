import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import { OrderNotAvailableForDeliverError } from '@/modules/orders/use-cases/errors/order-not-available-for-deliver'
import { OrderNotFoundError } from '@/modules/orders/use-cases/errors/order-not-found'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryEventsRepository } from 'test/repositories/in-memory-delivery-events.repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeliverOrderUseCase } from './deliver-order.use-case'
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliverymanRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryEventsRepository: InMemoryDeliveryEventsRepository
let sut: DeliverOrderUseCase

describe('DeliverOrderUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryDeliverymanRepository = new InMemoryUsersRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryDeliveryEventsRepository = new InMemoryDeliveryEventsRepository()
		sut = new DeliverOrderUseCase(
			inMemoryDeliverymanRepository,
			inMemoryDeliveryEventsRepository,
			inMemoryOrdersRepository,
		)
	})

	it('should be able to deliver an order', async () => {
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.WITHDRAWN,
			deliverymanId: deliveryman.id,
		})

		await inMemoryDeliverymanRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		await sut.execute({
			deliverymanId: deliveryman.id,
			orderId: order.id,
			deliveryPhotoId: 'photo-id',
		})

		expect(inMemoryDeliveryEventsRepository.items).toHaveLength(1)
		expect(inMemoryDeliveryEventsRepository.items[0]).toEqual(
			expect.objectContaining({
				orderId: order.id,
				status: EOrderStatusEnum.DELIVERED,
				userId: deliveryman.id,
			}),
		)

		expect(inMemoryOrdersRepository.items[0].status).toBe(EOrderStatusEnum.DELIVERED)
		expect(inMemoryOrdersRepository.items[0].deliveryPhotoId).toBe('photo-id')
	})

	it('should not be able to deliver an order if it is not withdrawn', async () => {
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.PENDING,
			deliverymanId: deliveryman.id,
		})

		await inMemoryDeliverymanRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		await expect(() =>
			sut.execute({
				deliverymanId: deliveryman.id,
				orderId: order.id,
				deliveryPhotoId: 'photo-id',
			}),
		).rejects.toBeInstanceOf(OrderNotAvailableForDeliverError)
	})

	it('should not be able to deliver an order if deliveryman not exists', async () => {
		const order = makeOrder({
			status: EOrderStatusEnum.WITHDRAWN,
		})

		await inMemoryOrdersRepository.create(order)

		await expect(() =>
			sut.execute({
				deliverymanId: 'non-existent-id',
				orderId: order.id,
				deliveryPhotoId: 'photo-id',
			}),
		).rejects.toBeInstanceOf(DeliverymanNotFoundError)
	})

	it('should not be able to deliver an order if order not exists', async () => {
		const deliveryman = makeDeliveryman()

		await inMemoryDeliverymanRepository.create(deliveryman)

		await expect(() =>
			sut.execute({
				deliverymanId: deliveryman.id,
				orderId: 'non-existent-id',
				deliveryPhotoId: 'photo-id',
			}),
		).rejects.toBeInstanceOf(OrderNotFoundError)
	})

	it('should not be able to deliver an order if order does not belong to the deliveryman', async () => {
		const deliveryman1 = makeDeliveryman()
		const deliveryman2 = makeDeliveryman()

		const order = makeOrder({
			status: EOrderStatusEnum.WITHDRAWN,
			deliverymanId: deliveryman1.id,
		})

		await inMemoryDeliverymanRepository.create(deliveryman1)
		await inMemoryDeliverymanRepository.create(deliveryman2)
		await inMemoryOrdersRepository.create(order)

		await expect(() =>
			sut.execute({
				deliverymanId: deliveryman2.id,
				orderId: order.id,
				deliveryPhotoId: 'photo-id',
			}),
		).rejects.toBeInstanceOf(OrderNotAvailableForDeliverError)
	})
})
