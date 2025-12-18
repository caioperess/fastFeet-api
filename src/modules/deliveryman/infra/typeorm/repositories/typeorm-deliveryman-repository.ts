import type { DeliverymanRepository } from '@/modules/deliveryman/repositories/deliveryman-repository'
import type { User } from '@/modules/users/infra/typeorm/entities/user'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { Deliveryman } from '../entities/deliveryman'

export class TypeormDeliverymanRepository implements DeliverymanRepository {
	private readonly repository: Repository<Deliveryman>

	constructor() {
		this.repository = AppDataSource.getRepository(Deliveryman)
	}

	async create(data: Deliveryman): Promise<Deliveryman> {
		const deliveryman = this.repository.create(data)
		return await this.repository.save(deliveryman)
	}

	async save(deliveryman: Deliveryman): Promise<Deliveryman> {
		return await this.repository.save(deliveryman)
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id)
	}

	async findByCpf(cpf: string): Promise<Deliveryman | null> {
		return await this.repository.findOneBy({ cpf })
	}

	async findById(id: string): Promise<Deliveryman | null> {
		return await this.repository.findOneBy({ id })
	}

	async findByPhone(phone: string): Promise<User | null> {
		return this.repository.findOneBy({ phone })
	}
}
