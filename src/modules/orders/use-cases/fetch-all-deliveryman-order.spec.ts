import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeliverymanNotFoundError } from '@/modules/deliveryman/use-cases/errors/deliveryman-not-found'
import { EOrderStatusEnum } from '../enums/status-enum'
import { FetchAllDeliverymanOrderUseCase } from './fetch-all-deliveryman-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchAllDeliverymanOrderUseCase

describe('FetchAllDeliverymanOrderUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryRecipientsRepository)
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new FetchAllDeliverymanOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
	})

	it('should be able to fetch all orders of a deliveryman', async () => {
		const deliveryman = makeDeliveryman()
		const order = makeOrder({ status: EOrderStatusEnum.DELIVERED, deliverymanId: deliveryman.id })

		await inMemoryUsersRepository.create(deliveryman)
		await inMemoryOrdersRepository.create(order)

		const result = await sut.execute({ deliverymanId: deliveryman.id })

		expect(result).toHaveLength(1)
		expect(result[0]).toEqual(order)
	})

	it('should not be able to fetch all orders of a deliveryman if deliveryman not found', async () => {
		await expect(() => sut.execute({ deliverymanId: 'deliveryman-1' })).rejects.toBeInstanceOf(DeliverymanNotFoundError)
	})
})
