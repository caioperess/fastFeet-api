import { TypeOrmUsersRepository } from '../../infra/typeorm/repositories/typeorm-users-repository'
import { AuthenticateUserUseCase } from '../authenticate.use-case'

export function makeAuthenticateUserUseCase() {
	const usersRepository = new TypeOrmUsersRepository()

	return new AuthenticateUserUseCase(usersRepository)
}
