import type { Order } from '@/modules/orders/infra/typeorm/orders'
import type { OrdersRepository } from '@/modules/orders/repositories/orders-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
	public orders: Order[] = []

	async create(data: Order): Promise<Order> {
		this.orders.push(data)
		return data
	}

	async save(data: Order): Promise<Order> {
		const orderIndex = this.orders.findIndex((o) => o.id === data.id)
		this.orders[orderIndex] = data

		return data
	}

	async delete(id: string): Promise<void> {
		this.orders = this.orders.filter((o) => o.id !== id)
	}

	async findById(id: string): Promise<Order | null> {
		return this.orders.find((o) => o.id === id) || null
	}

	async findByDeliverymanId(deliverymanId: string): Promise<Order[]> {
		return this.orders.filter((o) => o.deliverymanId === deliverymanId)
	}

	async findNearbyOrdersByDeliveryman(deliverymanId: string): Promise<Order[]> {
		const nearbyOrders = this.orders.filter((o) => o.deliverymanId === deliverymanId)

		return nearbyOrders
	}
}
