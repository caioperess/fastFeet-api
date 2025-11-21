import type { User } from '../infra/typeorm/entities/user'

export abstract class UsersRepository {
	abstract create(data: User): Promise<User>
	abstract save(user: User): Promise<User>
	abstract delete(id: string): Promise<void>
	abstract findById(id: string): Promise<User | null>
	abstract findByCpf(cpf: string): Promise<User | null>
}
