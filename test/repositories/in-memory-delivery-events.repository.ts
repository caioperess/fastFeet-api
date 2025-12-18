import { DeliveryEvents } from '@/modules/orders/infra/typeorm/entities/delivery-events'
import type { DeliveryEventsRepository } from '@/modules/orders/repositories/delivery-events-repository'

export class InMemoryDeliveryEventsRepository implements DeliveryEventsRepository {
	public items: DeliveryEvents[] = []

	async findById(id: string): Promise<DeliveryEvents | null> {
		return this.items.find((deliveryEvent) => deliveryEvent.id === id) ?? null
	}

	async findManyByOrderId(orderId: string): Promise<DeliveryEvents[]> {
		return this.items.filter((deliveryEvent) => deliveryEvent.orderId === orderId)
	}

	async create(deliveryEvents: DeliveryEvents): Promise<DeliveryEvents> {
		const deliveryEvent = DeliveryEvents.create(deliveryEvents)
		this.items.push(deliveryEvent)

		return deliveryEvent
	}
}
