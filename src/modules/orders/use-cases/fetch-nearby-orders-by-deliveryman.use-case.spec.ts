import { DeliverymanNotFoundError } from '@/modules/deliveryman/use-cases/errors/deliveryman-not-found'
import { expect } from 'node_modules/vitest/dist'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { EOrderStatusEnum } from '../enums/status-enum'
import { FetchNearbyOrdersByDeliverymanUseCase } from './fetch-nearby-orders-by-deliveryman.use-case'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchNearbyOrdersByDeliverymanUseCase

describe('FetchNearbyOrdersByDeliverymanUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new FetchNearbyOrdersByDeliverymanUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
	})

	it('should be able to fetch all nearby orders of a deliveryman', async () => {
		const recipient = makeRecipient({
			latitude: -22.177325,
			longitude: -49.989319,
		})
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.WITHDRAWN,
			deliverymanId: deliveryman.id,
			recipientId: recipient.id,
		})

		await inMemoryRecipientsRepository.create(recipient)
		await inMemoryUsersRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		const { orders } = await sut.execute({
			deliverymanId: deliveryman.id,
			latitude: -22.226589,
			longitude: -49.938774,
		})

		expect(orders).toHaveLength(1)
		expect(orders[0]).toEqual(order)
	})

	it('should not be able to fetch an order if its out of search range', async () => {
		const recipient = makeRecipient({
			latitude: -22.230783,
			longitude: -50.274572,
		})
		const deliveryman = makeDeliveryman()
		const order = makeOrder({
			status: EOrderStatusEnum.WITHDRAWN,
			deliverymanId: deliveryman.id,
			recipientId: recipient.id,
		})

		await inMemoryRecipientsRepository.create(recipient)
		await inMemoryUsersRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		const { orders } = await sut.execute({
			deliverymanId: deliveryman.id,
			latitude: -22.226589,
			longitude: -49.938774,
		})

		expect(orders).toHaveLength(0)
	})

	it('should not be able to fetch all orders of a deliveryman if deliveryman not found', async () => {
		await expect(() =>
			sut.execute({ deliverymanId: 'deliveryman-1', latitude: 0, longitude: 0 }),
		).rejects.toBeInstanceOf(DeliverymanNotFoundError)
	})
})
