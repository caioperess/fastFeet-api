import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { RecipientEmailAlreadyInUseError } from './errors/email-already-in-use'
import { RecipientNotFoundError } from './errors/recipient-not-found'
import { UpdateRecipientUseCase } from './update-recipient.use-case'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: UpdateRecipientUseCase

describe('UpdateRecipientUseCase', () => {
	beforeEach(() => {
		inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
		sut = new UpdateRecipientUseCase(inMemoryRecipientsRepository)
	})

	it('should be able to update a recipient', async () => {
		const recipient = makeRecipient()
		const newRecipient = makeRecipient()

		await inMemoryRecipientsRepository.create(recipient)

		await sut.execute({
			...newRecipient,
			id: recipient.id,
		})

		expect(inMemoryRecipientsRepository.items[0]).toEqual({ ...newRecipient, id: recipient.id })
	})

	it('should not be able to update a recipient with same email', async () => {
		const recipient = makeRecipient()
		const newRecipient = makeRecipient({ email: recipient.email })

		await inMemoryRecipientsRepository.create(recipient)

		await expect(() =>
			sut.execute({
				...newRecipient,
				id: recipient.id,
			}),
		).rejects.toBeInstanceOf(RecipientEmailAlreadyInUseError)
	})

	it('should not be able to update a recipient that does not exist', async () => {
		await expect(() => sut.execute(makeRecipient({}, 'fake-id'))).rejects.toBeInstanceOf(RecipientNotFoundError)
	})
})
