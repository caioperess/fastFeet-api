import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateRecipientUseCase } from './create-recipient.use-case'
import { RecipientEmailAlreadyInUseError } from './errors/email-already-in-use'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('FetchNearbyOrdersByDeliverymanUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
	})

	it('should be able to create a recipient', async () => {
		const recipient = makeRecipient()

		const result = await sut.execute(recipient)

		expect(inMemoryRecipientsRepository.items[0].id).toEqual(result.recipient.id)
	})

	it('should not be able to create a recipient with same email', async () => {
		const recipient = makeRecipient()
		await inMemoryRecipientsRepository.create(recipient)

		await expect(() => sut.execute(recipient)).rejects.toBeInstanceOf(RecipientEmailAlreadyInUseError)
	})
})
