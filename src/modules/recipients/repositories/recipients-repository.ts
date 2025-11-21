import type { Recipient } from '../infra/typeorm/entities/recipients'

export abstract class RecipientsRepository {
	abstract create(recipients: Recipient): Promise<Recipient>
	abstract save(recipients: Recipient): Promise<Recipient>
	abstract delete(id: string): Promise<void>
	abstract findById(id: string): Promise<Recipient | null>
}
