export class AdminAlreadyExistsError extends Error {
	constructor() {
		super('Admin already exists')
	}
}
