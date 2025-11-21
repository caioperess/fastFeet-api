import { compare } from 'bcryptjs'
import type { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials'

interface AuthenticateUserUseCaseParams {
	cpf: string
	password: string
}

export class AuthenticateUserUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ cpf, password }: AuthenticateUserUseCaseParams) {
		const user = await this.usersRepository.findByCpf(cpf)

		if (!user) {
			throw new WrongCredentialsError()
		}

		const isPasswordValid = await compare(password, user.passwordHash)

		if (!isPasswordValid) {
			throw new WrongCredentialsError()
		}

		return { user }
	}
}
