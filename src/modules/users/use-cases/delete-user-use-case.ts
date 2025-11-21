import type { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found'

export class DeleteUserUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(id: string): Promise<void> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new UserNotFoundError()
		}

		await this.usersRepository.delete(user.id)
	}
}
