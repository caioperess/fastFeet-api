import type { Order } from '../infra/typeorm/orders'

export type FindNearbyOrdersByDeliverymanParams = {
	deliverymanId: string
	latitude: number
	longitude: number
}

export abstract class OrdersRepository {
	abstract create(data: Order): Promise<Order>
	abstract save(data: Order): Promise<Order>
	abstract delete(id: string): Promise<void>
	abstract findById(id: string): Promise<Order | null>
	abstract findByDeliverymanId(deliverymanId: string): Promise<Order[]>
	abstract findNearbyOrdersByDeliveryman({
		deliverymanId,
		latitude,
		longitude,
	}: FindNearbyOrdersByDeliverymanParams): Promise<Order[]>
}
