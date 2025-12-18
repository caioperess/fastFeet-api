import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate.use-case'
import { WrongCredentialsError } from './errors/wrong-credentials'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUserUseCase(inMemoryUsersRepository)
	})

	it('should be able to authenticate an user', async () => {
		const password = faker.internet.password()
		const hashedPassword = await hash(password, 8)

		const user = makeAdmin({
			passwordHash: hashedPassword,
		})

		await inMemoryUsersRepository.create(user)

		const result = await sut.execute({
			cpf: user.cpf,
			password,
		})

		expect(result).toEqual({
			user,
		})
	})

	it('should not be able to authenticate a non existing user', async () => {
		await expect(
			sut.execute({
				cpf: 'fake-cpf',
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(WrongCredentialsError)
	})

	it('should not be able to authenticate an user with wrong credentials', async () => {
		const user = makeAdmin()

		await inMemoryUsersRepository.create(user)

		await expect(
			sut.execute({
				cpf: user.cpf,
				password: 'fake-password',
			}),
		).rejects.toBeInstanceOf(WrongCredentialsError)
	})
})
