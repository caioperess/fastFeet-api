import { hash } from 'bcryptjs'
import type { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found'

export interface IChangeUserPasswordUseCaseParams {
	id: string
	password: string
}

export class ChangeUserPasswordUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ id, password }: IChangeUserPasswordUseCaseParams): Promise<void> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new UserNotFoundError()
		}

		user.passwordHash = await hash(password, 8)

		await this.usersRepository.save(user)
	}
}
