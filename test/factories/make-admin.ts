import { faker } from '@faker-js/faker'
import { AdminEntity } from '@/modules/admin/infra/typeorm/entities/admin'
import { EUserRole } from '@/modules/users/enums/role-enum'

export function makeAdmin(override?: Partial<AdminEntity>, id?: string) {
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
