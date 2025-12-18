import type { DeliveryEvents } from '../infra/typeorm/entities/delivery-events'

export abstract class DeliveryEventsRepository {
	abstract findById(id: string): Promise<DeliveryEvents | null>
	abstract findManyByOrderId(orderId: string): Promise<DeliveryEvents[]>
	abstract create(deliveryEvents: DeliveryEvents): Promise<DeliveryEvents>
}
