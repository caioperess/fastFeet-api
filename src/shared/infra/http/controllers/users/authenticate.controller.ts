import { jwtConfig } from '@/config/jwt'
import type { TypeOrmUsersRepository } from '@/modules/users/infra/typeorm/repositories/typeorm-users-repository'
import { AuthenticateUserUseCase } from '@/modules/users/use-cases/authenticate.use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const authenticateSchema = z.object({
	cpf: z.string().nonempty('Field required!'),
	password: z.string().nonempty('Field required!'),
})

export async function authenticateController(
	req: FastifyRequest<{ Body: z.infer<typeof authenticateSchema> }>,
	reply: FastifyReply,
) {
	const { cpf, password } = req.body

	const usersRepository = req.diScope.resolve<TypeOrmUsersRepository>('usersRepository')
	const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

	const { user } = await authenticateUserUseCase.execute({ cpf, password })

	const token = await reply.jwtSign(
		{
			role: user.role,
		},
		{ sign: { sub: user.id, expiresIn: jwtConfig.expirationTime } },
	)

	const refreshToken = await reply.jwtSign(
		{
			role: user.role,
		},
		{ sign: { sub: user.id, expiresIn: jwtConfig.refreshTokenExpirationTime } },
	)

	return reply
		.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
		})
		.status(200)
		.send({ token })
}
