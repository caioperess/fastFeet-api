import { searchOrderRadiusInKm } from '@/config/search-order-radius'
import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import type { Order } from '@/modules/orders/infra/typeorm/entities/orders'
import type {
	FindNearbyOrdersByDeliverymanParams,
	OrdersRepository,
} from '@/modules/orders/repositories/orders-repository'
import { getDistanceBetweenCoordinates } from '@/shared/utils/calculate-distance-between-coordinates'
import type { InMemoryRecipientsRepository } from './in-memory-recipients-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
	public items: Order[] = []

	constructor(private readonly recipientRepository: InMemoryRecipientsRepository) {}

	async create(data: Order): Promise<Order> {
		this.items.push(data)
		return data
	}

	async save(data: Order): Promise<Order> {
		const orderIndex = this.items.findIndex((o) => o.id === data.id)
		this.items[orderIndex] = data

		return data
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((o) => o.id !== id)
	}

	async findById(id: string): Promise<Order | null> {
		return this.items.find((o) => o.id === id) || null
	}

	async findByDeliverymanId(deliverymanId: string): Promise<Order[]> {
		return this.items.filter((o) => o.deliverymanId === deliverymanId)
	}

	async findNearbyOrdersByDeliveryman({
		deliverymanId,
		latitude,
		longitude,
	}: FindNearbyOrdersByDeliverymanParams): Promise<Order[]> {
		const nearbyOrders = this.items.filter((order) => {
			if (order.status !== EOrderStatusEnum.WITHDRAWN) return false

			if (order.deliverymanId !== deliverymanId) return false

			const recipient = this.recipientRepository.items.find((recipient) => recipient.id === order.recipientId)

			if (!recipient) {
				throw new Error(`Recipient with id ${order.recipientId} not found`)
			}

			const distance = getDistanceBetweenCoordinates(
				{ latitude, longitude },
				{ latitude: recipient.latitude, longitude: recipient.longitude },
			)

			return distance < searchOrderRadiusInKm
		})

		return nearbyOrders
	}
}
