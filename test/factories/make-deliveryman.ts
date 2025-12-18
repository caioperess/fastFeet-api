import { Deliveryman } from '@/modules/deliveryman/infra/typeorm/entities/deliveryman'
import { EUserRole } from '@/modules/users/enums/role-enum'
import type { IUserProps } from '@/modules/users/infra/typeorm/entities/user'
import { faker } from '@faker-js/faker'

export function makeDeliveryman(override?: Partial<IUserProps>, id?: string) {
	const deliveryman = Deliveryman.create(
		{
			name: faker.person.firstName(),
			cpf: faker.string.numeric(11),
			passwordHash: faker.internet.password(),
			role: EUserRole.DELIVERYMAN,
			phone: faker.phone.number(),
			...override,
		},
		id,
	)

	return deliveryman
}
