export class OrderNotAvailableForDeliverError extends Error {
	constructor() {
		super('Order not available for deliver')
	}
}
