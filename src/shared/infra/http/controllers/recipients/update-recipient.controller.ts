import type { TypeOrmRecipientRepository } from '@/modules/recipients/infra/typeorm/repositories/typeorm-recipient-repository'
import { UpdateRecipientUseCase } from '@/modules/recipients/use-cases/update-recipient.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const updateRecipientSchema = z.object({
	id: z.uuid().nonempty('Field required!'),
	name: z.string().nonempty('Field required!'),
	neighborhood: z.string().nonempty('Field required!'),
	email: z.email().nonempty('Field required!'),
	city: z.string().nonempty('Field required!'),
	state: z.string().nonempty('Field required!'),
	zipCode: z.string().nonempty('Field required!'),
	number: z.string().nonempty('Field required!'),
	complement: z.string().optional(),
	latitude: z.number().nonoptional('Field required!'),
	longitude: z.number().nonoptional('Field required!'),
})

export async function updateRecipientController(
	req: FastifyRequest<{ Body: z.infer<typeof updateRecipientSchema> }>,
	reply: FastifyReply,
) {
	const recipientRepository = req.diScope.resolve<TypeOrmRecipientRepository>('recipientsRepository')

	const updateRecipientUseCase = new UpdateRecipientUseCase(recipientRepository)

	const { id, name, neighborhood, email, city, state, zipCode, number, complement, latitude, longitude } = req.body

	await updateRecipientUseCase.execute({
		id,
		name,
		neighborhood,
		email,
		city,
		state,
		zipCode,
		number,
		complement,
		latitude,
		longitude,
	})

	return reply.status(200).send()
}
