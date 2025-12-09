import type { FastifyReply, FastifyRequest } from 'fastify'
import type { IRecipientsProps } from '@/modules/recipients/infra/typeorm/entities/recipients'
import type { TypeOrmRecipientRepository } from '@/modules/recipients/infra/typeorm/repositories/typeorm-recipient-repository'
import { CreateRecipientUseCase } from '@/modules/recipients/use-cases/create-recipient.use-case'

export async function createRecipientController(req: FastifyRequest, reply: FastifyReply) {
	try {
		const recipientsRepository = req.diScope.resolve<TypeOrmRecipientRepository>('recipientsRepository')

		const createRecipientUseCase = new CreateRecipientUseCase(recipientsRepository)

		const data = req.body as IRecipientsProps

		await createRecipientUseCase.execute(data)

		return reply.status(201).send()
	} catch (error) {
		console.error(error)
		return reply.status(500).send({ error: 'Internal server error' })
	}
}
