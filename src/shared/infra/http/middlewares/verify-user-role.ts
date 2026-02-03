import type { EUserRole } from '@/modules/users/enums/role-enum'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: EUserRole) {
	return async (req: FastifyRequest, reply: FastifyReply) => {
		const { role } = req.user

		if (role !== roleToVerify) {
			return reply.status(401).send({ message: 'Unauthorized' })
		}
	}
}
