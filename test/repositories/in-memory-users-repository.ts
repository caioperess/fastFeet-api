import type { User } from '@/modules/users/infra/typeorm/entities/user'
import type { UsersRepository } from '@/modules/users/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async create(data: User): Promise<User> {
		this.items.push(data)
		return data
	}

	async save(user: User): Promise<User> {
		const userIndex = this.items.findIndex((u) => u.id === user.id)
		this.items[userIndex] = user

		return user
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((u) => u.id !== id)
	}

	async findById(id: string): Promise<User | null> {
		return this.items.find((u) => u.id === id) || null
	}

	async findByCpf(cpf: string): Promise<User | null> {
		return this.items.find((u) => u.cpf === cpf) || null
	}
}
