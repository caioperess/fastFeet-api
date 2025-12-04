import type { User } from '@/modules/users/infra/typeorm/entities/user'
import type { UsersRepository } from '@/modules/users/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = []

	async create(data: User): Promise<User> {
		this.users.push(data)
		return data
	}

	async save(user: User): Promise<User> {
		const userIndex = this.users.findIndex((u) => u.id === user.id)
		this.users[userIndex] = user

		return user
	}

	async delete(id: string): Promise<void> {
		this.users = this.users.filter((u) => u.id !== id)
	}

	async findById(id: string): Promise<User | null> {
		return this.users.find((u) => u.id === id) || null
	}

	async findByCpf(cpf: string): Promise<User | null> {
		return this.users.find((u) => u.cpf === cpf) || null
	}
}
