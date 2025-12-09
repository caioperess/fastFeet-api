import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateAdminUseCase } from '@/modules/admin/use-cases/create-admin.use-case'
import type { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'

export async function createAdminController(req: FastifyRequest, reply: FastifyReply) {
	try {
		const usersRepository = req.diScope.resolve<TypeOrmUsersRepository>('usersRepository')

		const createAdminUseCase = new CreateAdminUseCase(usersRepository)

		const { cpf, password, name, phone } = req.body as any

		await createAdminUseCase.execute({ cpf, name, password, phone })

		return reply.status(201).send()
	} catch (error) {
		console.error(error)
		return reply.status(500).send({ error: 'Internal server error' })
	}
}
