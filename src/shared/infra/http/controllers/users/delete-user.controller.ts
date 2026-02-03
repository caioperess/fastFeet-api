import type { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'
import { DeleteUserUseCase } from '@/modules/users/use-cases/delete-user-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const deleteUserParamsSchema = z.object({
	userId: z.string().nonempty('Field required!'),
})

export async function deleteUserController(
	req: FastifyRequest<{ Params: z.infer<typeof deleteUserParamsSchema> }>,
	reply: FastifyReply,
) {
	const { userId } = req.params

	const usersRepository = req.diScope.resolve<TypeOrmUsersRepository>('usersRepository')
	const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

	await deleteUserUseCase.execute(userId)

	return reply.status(200).send()
}
