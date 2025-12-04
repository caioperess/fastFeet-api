import type { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import type { RecipientsRepository } from '@/modules/recipients/repositories/recipients-repository'

export class InMemoryRecipientsRepository implements RecipientsRepository {
	public recipients: Recipient[] = []

	async create(recipients: Recipient): Promise<Recipient> {
		this.recipients.push(recipients)
		return recipients
	}

	async save(recipients: Recipient): Promise<Recipient> {
		const recipientIndex = this.recipients.findIndex((r) => r.id === recipients.id)
		this.recipients[recipientIndex] = recipients

		return recipients
	}

	async delete(id: string): Promise<void> {
		this.recipients = this.recipients.filter((r) => r.id !== id)
	}

	async findById(id: string): Promise<Recipient | null> {
		return this.recipients.find((r) => r.id === id) || null
	}
}
