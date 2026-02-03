import 'src/env'

import { hash } from 'bcryptjs'

import { AdminEntity } from 'src/modules/admin/infra/typeorm/entities/admin'
import { EUserRole } from 'src/modules/users/enums/role-enum'
import { AppDataSource, initializeDataSource } from 'src/shared/infra/database'

async function main() {
	await initializeDataSource()
	const adminRepository = AppDataSource.getRepository(AdminEntity)

	const passwordHash = await hash('123456', 8)

	const admin = adminRepository.create({
		name: 'Admin',
		cpf: '11111111111',
		passwordHash,
		role: EUserRole.ADMIN,
		phone: '11999999999',
	})

	await adminRepository.save(admin)

	await AppDataSource.destroy()
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
