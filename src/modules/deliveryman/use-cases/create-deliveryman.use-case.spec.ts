import { compareSync } from 'bcryptjs'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateDeliverymanUseCase } from './create-deliveryman.use-case'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists'

let inMemoryDeliverymanRepository: InMemoryUsersRepository
let sut: CreateDeliverymanUseCase

describe('CreateDeliverymanUseCase', () => {
	beforeEach(() => {
		inMemoryDeliverymanRepository = new InMemoryUsersRepository()
		sut = new CreateDeliverymanUseCase(inMemoryDeliverymanRepository)
	})

	it('should be able to create a deliveryman', async () => {
		const deliveryman = makeDeliveryman()
		const password = 'password123'

		await sut.execute({
			name: deliveryman.name,
			cpf: deliveryman.cpf,
			phone: deliveryman.phone,
			password,
		})

		expect(inMemoryDeliverymanRepository.items).toHaveLength(1)
		expect(compareSync(password, inMemoryDeliverymanRepository.items[0].passwordHash)).toBe(true)
	})

	it('should not be able to create a deliveryman with existing CPF', async () => {
		const deliveryman = makeDeliveryman()

		await sut.execute({
			name: deliveryman.name,
			cpf: deliveryman.cpf,
			phone: deliveryman.phone,
			password: 'fake-password',
		})

		await expect(() =>
			sut.execute({
				name: 'Another Name',
				cpf: deliveryman.cpf,
				phone: 'another-phone',
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(DeliverymanAlreadyExistsError)
	})

	it('should not be able to create a deliveryman with existing phone', async () => {
		const deliveryman = makeDeliveryman()

		await sut.execute({
			name: deliveryman.name,
			cpf: deliveryman.cpf,
			phone: deliveryman.phone,
			password: 'password123',
		})

		await expect(() =>
			sut.execute({
				name: 'Another Name',
				cpf: 'another-cpf',
				phone: deliveryman.phone,
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(DeliverymanAlreadyExistsError)
	})
})
