import type { UsersRepository } from '@/modules/users/repositories/users-repository'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { User } from '../entities/user'

export class TypeOrmUsersRepository implements UsersRepository {
	private readonly repository: Repository<User>

	constructor() {
		this.repository = AppDataSource.getRepository(User)
	}

	async create(data: User): Promise<User> {
		const user = this.repository.create(data)
		return await this.repository.save(user)
	}

	async save(user: User): Promise<User> {
		return await this.repository.save(user)
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id)
	}

	async findById(id: string): Promise<User | null> {
		return await this.repository.findOne({ where: { id } })
	}

	async findByCpf(cpf: string): Promise<User | null> {
		return await this.repository.findOne({ where: { cpf } })
	}

	async findByPhone(phone: string): Promise<User | null> {
		return await this.repository.findOneBy({ phone })
	}
}
