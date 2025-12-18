import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UserNotFoundError } from './errors/user-not-found'
import { UpdateUserUseCase } from './update-user.use-case'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new UpdateUserUseCase(inMemoryUsersRepository)
	})

	it('should be able to update an user', async () => {
		const user = makeAdmin()

		await inMemoryUsersRepository.create(user)

		const result = await sut.execute({ cpf: 'fake-cpf', id: user.id, name: 'fake-name', phone: 'fake-phone' })

		expect(result.user).toEqual({
			...user,
			name: 'fake-name',
			cpf: 'fake-cpf',
			phone: 'fake-phone',
		})
	})

	it('should not be able to update a non existing user', async () => {
		await expect(
			sut.execute({ cpf: 'fake-cpf', id: 'fake-id', name: 'fake-name', phone: 'fake-phone' }),
		).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
