export class OrderNotAvailableForWithdrawnError extends Error {
	constructor() {
		super('Order not available for withdrawn')
	}
}
