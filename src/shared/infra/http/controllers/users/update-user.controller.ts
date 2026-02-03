import type { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'
import { UpdateUserUseCase } from '@/modules/users/use-cases/update-user.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const updateUsersSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
	name: z.string().nonempty('Field required!'),
	cpf: z.string().nonempty('Field required!'),
	phone: z.string().nonempty('Field required!'),
})

export async function updateUserController(
	req: FastifyRequest<{ Body: z.infer<typeof updateUsersSchema> }>,
	reply: FastifyReply,
) {
	const { id, name, cpf, phone } = req.body

	const usersRepository = req.diScope.resolve<TypeOrmUsersRepository>('usersRepository')
	const updateUserUseCase = new UpdateUserUseCase(usersRepository)

	await updateUserUseCase.execute({ id, name, cpf, phone })

	return reply.status(200).send()
}
