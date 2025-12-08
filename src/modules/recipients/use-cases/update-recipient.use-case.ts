import type { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from './errors/recipient-not-found'

export interface IUpdateRecipientUseCaseParams {
	id: string
	name: string
	neighborhood: string
	city: string
	state: string
	zipCode: string
	email: string
	number: string
	complement?: string
	latitude: number
	longitude: number
}

export class UpdateRecipientUseCase {
	constructor(private readonly recipientsRepository: RecipientsRepository) {}

	async execute(data: IUpdateRecipientUseCaseParams): Promise<void> {
		const recipient = await this.recipientsRepository.findById(data.id)

		if (!recipient) {
			throw new RecipientNotFoundError()
		}

		Object.assign(recipient, data)

		await this.recipientsRepository.save(recipient)
	}
}
