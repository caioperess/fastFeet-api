import { env } from '@/env'

export const jwtConfig = {
	secret: env.JWT_SECRET,
	expirationTime: '10m',
	refreshTokenExpirationTime: '7d',
}
