import { AdminEntity } from '@/modules/admin/infra/typeorm/entities/admin'
import { EUserRole } from '@/modules/users/enums/role-enum'
import type { IUserProps } from '@/modules/users/infra/typeorm/entities/user'
import { faker } from '@faker-js/faker'

export function makeAdmin(override?: Partial<IUserProps>, id?: string) {
	const admin = AdminEntity.create(
		{
			name: faker.person.firstName(),
			cpf: faker.string.numeric(11),
			passwordHash: faker.internet.password(),
			role: EUserRole.ADMIN,
			phone: faker.phone.number(),
			...override,
		},
		id,
	)

	return admin
}
