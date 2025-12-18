import type { AdminRepository } from '@/modules/admin/repositories/admin-repository'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { AdminEntity } from '../entities/admin'

export class TypeormAdminRepository implements AdminRepository {
	private readonly repository: Repository<AdminEntity>

	constructor() {
		this.repository = AppDataSource.getRepository(AdminEntity)
	}

	async create(data: AdminEntity): Promise<AdminEntity> {
		const admin = this.repository.create(data)
		return await this.repository.save(admin)
	}

	async save(admin: AdminEntity): Promise<AdminEntity> {
		return await this.repository.save(admin)
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id)
	}

	async findByCpf(cpf: string): Promise<AdminEntity | null> {
		return await this.repository.findOneBy({ cpf })
	}

	async findById(id: string): Promise<AdminEntity | null> {
		return await this.repository.findOneBy({ id })
	}

	async findByPhone(phone: string): Promise<AdminEntity | null> {
		return this.repository.findOneBy({ phone })
	}
}
