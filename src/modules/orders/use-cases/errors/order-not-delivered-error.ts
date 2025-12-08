export class OrderNotDeliveredError extends Error {
	constructor() {
		super('Order not delivered')
	}
}
