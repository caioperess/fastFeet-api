import { faker } from '@faker-js/faker'
import { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'

export function makeRecipient(override?: Partial<Recipient>, id?: string) {
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
