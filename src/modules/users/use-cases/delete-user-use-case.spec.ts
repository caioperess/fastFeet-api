import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user-use-case'
import { UserNotFoundError } from './errors/user-not-found'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new DeleteUserUseCase(inMemoryUsersRepository)
	})

	it('should be able to delete an user', async () => {
		const user = makeAdmin()

		await inMemoryUsersRepository.create(user)

		await sut.execute(user.id)

		expect(inMemoryUsersRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a non existing user', async () => {
		await expect(sut.execute('fake-id')).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
