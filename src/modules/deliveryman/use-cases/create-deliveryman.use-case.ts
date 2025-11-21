import { EUserRole } from '@/modules/users/enums/role-enum'
import { hash } from 'bcryptjs'
import { Deliveryman } from '../infra/typeorm/entities/deliveryman'
import type { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists'

interface CreateDeliverymanUseCaseParams {
	name: string
	cpf: string
	password: string
	phone: string
}

export class CreateDeliverymanUseCase {
	constructor(private readonly deliverymanRepository: DeliverymanRepository) {}

	async execute({ name, cpf, password, phone }: CreateDeliverymanUseCaseParams) {
		const userAlreadyExists = await this.deliverymanRepository.findByCpf(cpf)

		if (userAlreadyExists) {
			throw new DeliverymanAlreadyExistsError()
		}

		const passwordHash = await hash(password, 8)

		const user = Deliveryman.create({
			name,
			cpf,
			passwordHash,
			role: EUserRole.DELIVERYMAN,
			phone,
		})

		await this.deliverymanRepository.create(user)
	}
}
