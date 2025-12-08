import type { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import type { RecipientsRepository } from '@/modules/recipients/repositories/recipients-repository'

export class InMemoryRecipientsRepository implements RecipientsRepository {
	public items: Recipient[] = []

	async create(recipients: Recipient): Promise<Recipient> {
		this.items.push(recipients)
		return recipients
	}

	async save(recipients: Recipient): Promise<Recipient> {
		const recipientIndex = this.items.findIndex((r) => r.id === recipients.id)
		this.items[recipientIndex] = recipients

		return recipients
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((r) => r.id !== id)
	}

	async findById(id: string): Promise<Recipient | null> {
		return this.items.find((r) => r.id === id) || null
	}
}
