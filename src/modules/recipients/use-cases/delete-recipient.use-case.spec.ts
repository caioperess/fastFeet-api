import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient.use-case'
import { RecipientNotFoundError } from './errors/recipient-not-found'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('DeleteRecipientUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
	})

	it('should be able to delete a recipient', async () => {
		const recipient = makeRecipient()

		await inMemoryRecipientsRepository.create(recipient)

		await sut.execute(recipient.id)

		expect(inMemoryRecipientsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a recipient that does not exist', async () => {
		await expect(() => sut.execute('fake-id')).rejects.toBeInstanceOf(RecipientNotFoundError)
	})
})
