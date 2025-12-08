import type { DeliveryEvents } from '../infra/typeorm/delivery-events'

export abstract class DeliveryEventsRepository {
	abstract findById(id: string): Promise<DeliveryEvents | null>
	abstract findByOrderId(orderId: string): Promise<DeliveryEvents[]>
	abstract create(deliveryEvents: DeliveryEvents): Promise<void>
}
