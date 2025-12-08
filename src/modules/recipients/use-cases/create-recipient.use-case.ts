import { Recipient } from '../infra/typeorm/entities/recipients'
import type { RecipientsRepository } from '../repositories/recipients-repository'

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

	async execute(data: ICreateRecipientUseCaseParams): Promise<void> {
		const recipient = Recipient.create(data)

		await this.recipientsRepository.create(recipient)
	}
}
