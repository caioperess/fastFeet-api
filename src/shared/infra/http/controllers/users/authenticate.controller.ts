import { jwtConfig } from '@/config/jwt'
import { makeAuthenticateUserUseCase } from '@/modules/users/use-cases/factories/make-authenticate-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticateController(req: FastifyRequest, reply: FastifyReply) {
	try {
		const { cpf, password } = req.body as any

		const authenticateUserUseCase = makeAuthenticateUserUseCase()

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
	} catch (error) {
		console.error(error)
		return reply.status(500).send({ error: 'Internal server error' })
	}
}
