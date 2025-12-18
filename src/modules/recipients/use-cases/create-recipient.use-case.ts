import { Recipient } from '../infra/typeorm/entities/recipients'
import type { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientEmailAlreadyInUseError } from './errors/email-already-in-use'

export interface ICreateRecipientUseCaseParams {
	name: string
	neighborhood: string
	city: string
	state: string
	email: string
	zipCode: string
	number: string
	complement?: string
	latitude: number
	longitude: number
}

export class CreateRecipientUseCase {
	constructor(private readonly recipientsRepository: RecipientsRepository) {}

	async execute(data: ICreateRecipientUseCaseParams) {
		const hasRecipientWithSameEmail = await this.recipientsRepository.findByEmail(data.email)

		if (hasRecipientWithSameEmail) {
			throw new RecipientEmailAlreadyInUseError()
		}

		const recipient = Recipient.create(data)

		await this.recipientsRepository.create(recipient)

		return { recipient }
	}
}
