import { CreateDeliverymanUseCase } from '@/modules/deliveryman/use-cases/create-deliveryman.use-case'
import type { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const createDeliverymanSchema = z.object({
	cpf: z.string().nonempty('Field required!'),
	password: z.string().nonempty('Field required!'),
	name: z.string().nonempty('Field required!'),
	phone: z.string().nonempty('Field required!'),
})

export async function createDeliverymanController(
	req: FastifyRequest<{ Body: z.infer<typeof createDeliverymanSchema> }>,
	reply: FastifyReply,
) {
	const usersRepository = req.diScope.resolve<TypeOrmUsersRepository>('usersRepository')

	const createDeliverymanUseCase = new CreateDeliverymanUseCase(usersRepository)

	const { cpf, password, name, phone } = req.body

	await createDeliverymanUseCase.execute({ cpf, name, password, phone })

	return reply.status(201).send()
}
