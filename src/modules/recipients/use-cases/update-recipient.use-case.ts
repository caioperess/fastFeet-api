import type { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientEmailAlreadyInUseError } from './errors/email-already-in-use'
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

	async execute(data: IUpdateRecipientUseCaseParams) {
		const recipient = await this.recipientsRepository.findById(data.id)

		if (!recipient) {
			throw new RecipientNotFoundError()
		}

		const recipientWithSameEmail = await this.recipientsRepository.findByEmail(data.email)

		if (recipientWithSameEmail) {
			throw new RecipientEmailAlreadyInUseError()
		}

		Object.assign(recipient, data)

		await this.recipientsRepository.save(recipient)

		return { recipient }
	}
}
