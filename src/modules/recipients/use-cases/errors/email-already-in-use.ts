export class RecipientEmailAlreadyInUseError extends Error {
	constructor() {
		super('Email already in use')
	}
}
