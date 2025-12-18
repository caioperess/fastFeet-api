import { compareSync } from 'bcryptjs'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateAdminUseCase } from './create-admin.use-case'
import { AdminAlreadyExistsError } from './errors/admin-already-exists'

let inMemoryAdminRepository: InMemoryUsersRepository
let sut: CreateAdminUseCase

describe('CreateAdminUseCase', () => {
	beforeEach(() => {
		inMemoryAdminRepository = new InMemoryUsersRepository()
		sut = new CreateAdminUseCase(inMemoryAdminRepository)
	})

	it('should be able to create a admin', async () => {
		const admin = makeAdmin()
		const password = 'password123'

		await sut.execute({
			name: admin.name,
			cpf: admin.cpf,
			phone: admin.phone,
			password,
		})

		expect(inMemoryAdminRepository.items).toHaveLength(1)
		expect(compareSync(password, inMemoryAdminRepository.items[0].passwordHash)).toBe(true)
	})

	it('should not be able to create a admin with existing CPF', async () => {
		const admin = makeAdmin()

		await sut.execute({
			name: admin.name,
			cpf: admin.cpf,
			phone: admin.phone,
			password: 'fake-password',
		})

		await expect(() =>
			sut.execute({
				name: 'Another Name',
				cpf: admin.cpf,
				phone: 'another-phone',
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(AdminAlreadyExistsError)
	})

	it('should not be able to create a admin with existing phone', async () => {
		const admin = makeAdmin()

		await sut.execute({
			name: admin.name,
			cpf: admin.cpf,
			phone: admin.phone,
			password: 'password123',
		})

		await expect(() =>
			sut.execute({
				name: 'Another Name',
				cpf: 'another-cpf',
				phone: admin.phone,
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(AdminAlreadyExistsError)
	})
})
