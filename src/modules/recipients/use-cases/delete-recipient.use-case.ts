import type { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from './errors/recipient-not-found'

export class DeleteRecipientUseCase {
	constructor(private readonly recipientsRepository: RecipientsRepository) {}

	async execute(id: string): Promise<void> {
		const recipient = await this.recipientsRepository.findById(id)

		if (!recipient) {
			throw new RecipientNotFoundError()
		}

		await this.recipientsRepository.delete(recipient.id)
	}
}
