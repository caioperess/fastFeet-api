import type { RecipientsRepository } from '@/modules/recipients/repositories/recipients-repository'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { Recipient } from '../entities/recipients'

export class TypeOrmRecipientRepository implements RecipientsRepository {
	private readonly repository: Repository<Recipient>

	constructor() {
		this.repository = AppDataSource.getRepository(Recipient)
	}

	async create(recipients: Recipient): Promise<Recipient> {
		const recipient = this.repository.create(recipients)
		return await this.repository.save(recipient)
	}

	async save(recipients: Recipient): Promise<Recipient> {
		return await this.repository.save(recipients)
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id)
	}

	async findById(id: string): Promise<Recipient | null> {
		return await this.repository.findOneBy({ id })
	}

	async findByEmail(email: string): Promise<Recipient | null> {
		return await this.repository.findOneBy({ email })
	}
}
