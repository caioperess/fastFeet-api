import type { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found'

export interface IUpdateUserUseCaseParams {
	id: string
	name: string
	cpf: string
	phone: string
}

export class UpdateUserUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ id, name, cpf, phone }: IUpdateUserUseCaseParams): Promise<void> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new UserNotFoundError()
		}

		Object.assign(user, { name, cpf, phone })

		await this.usersRepository.save(user)
	}
}
