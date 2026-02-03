import type { TypeOrmRecipientRepository } from '@/modules/recipients/infra/typeorm/repositories/typeorm-recipient-repository'
import { DeleteRecipientUseCase } from '@/modules/recipients/use-cases/delete-recipient.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const deleteRecipientSchema = z.object({
	recipientId: z.string().nonempty('Field required!'),
})

export async function deleteRecipientController(
	req: FastifyRequest<{ Params: z.infer<typeof deleteRecipientSchema> }>,
	reply: FastifyReply,
) {
	const recipientRepository = req.diScope.resolve<TypeOrmRecipientRepository>('recipientsRepository')

	const deleteRecipientUseCase = new DeleteRecipientUseCase(recipientRepository)

	const { recipientId } = req.params

	await deleteRecipientUseCase.execute(recipientId)

	return reply.status(200).send()
}
