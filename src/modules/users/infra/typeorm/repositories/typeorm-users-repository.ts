import type { UsersRepository } from '@/modules/users/repositories/users-repository'
import type { User } from '../entities/user'

export class TypeOrmUsersRepository implements UsersRepository {
	async create(data: User): Promise<void> {
		throw new Error('Method not implemented.')
	}

	async findByCpf(cpf: string): Promise<User | null> {
		throw new Error('Method not implemented.')
	}
}
