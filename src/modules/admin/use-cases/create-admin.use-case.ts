import { hash } from 'bcryptjs'
import { EUserRole } from '@/modules/users/enums/role-enum'
import { AdminEntity } from '../infra/typeorm/entities/admin'
import type { AdminRepository } from '../repositories/admin-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists'

interface CreateAdminUseCaseParams {
	name: string
	cpf: string
	password: string
	phone: string
}

export class CreateAdminUseCase {
	constructor(private readonly adminRepository: AdminRepository) {}

	async execute({ name, cpf, password, phone }: CreateAdminUseCaseParams) {
		const adminAlreadyExists = await this.adminRepository.findByCpf(cpf)

		if (adminAlreadyExists) {
			throw new AdminAlreadyExistsError()
		}

		const passwordHash = await hash(password, 8)

		const admin = AdminEntity.create({
			name,
			cpf,
			phone,
			passwordHash,
			role: EUserRole.ADMIN,
		})

		await this.adminRepository.create(admin)
	}
}
