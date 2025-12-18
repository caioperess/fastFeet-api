import { faker } from '@faker-js/faker'
import { compareSync } from 'bcryptjs'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { ChangeUserPasswordUseCase } from './change-user-password'
import { UserNotFoundError } from './errors/user-not-found'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: ChangeUserPasswordUseCase

describe('Change User Password Use Case', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new ChangeUserPasswordUseCase(inMemoryUsersRepository)
	})

	it('should be able to change the password for a existing user', async () => {
		const password = faker.internet.password()

		const user = makeAdmin()

		await inMemoryUsersRepository.create(user)

		const result = await sut.execute({
			id: user.id,
			password,
		})

		expect(compareSync(password, result.user.passwordHash)).toBe(true)
	})

	it('should not be able to change the password for a non existing user', async () => {
		await expect(
			sut.execute({
				id: 'fake-id',
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
