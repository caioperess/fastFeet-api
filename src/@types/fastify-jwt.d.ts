import type { EUserRole } from '@/modules/users/enums/role-enum'
import '@fastify/jwt'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: {
			sub: string
			role: EUserRole
		}
	}
}
