import { type IRecipientsProps, Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import { faker } from '@faker-js/faker'

export function makeRecipient(override?: Partial<IRecipientsProps>, id?: string) {
	const recipient = Recipient.create(
		{
			city: faker.location.city(),
			email: faker.internet.email(),
			neighborhood: faker.location.city(),
			state: faker.location.state(),
			zipCode: faker.location.zipCode(),
			name: faker.person.firstName(),
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
			number: faker.location.buildingNumber(),
			...override,
		},
		id,
	)

	return recipient
}
