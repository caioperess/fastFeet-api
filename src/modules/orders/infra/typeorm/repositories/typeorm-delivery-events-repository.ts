import type { DeliveryEventsRepository } from '@/modules/orders/repositories/delivery-events-repository'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { DeliveryEvents } from '../entities/delivery-events'

export class TypeormDeliveryEventsRepository implements DeliveryEventsRepository {
	private readonly repository: Repository<DeliveryEvents>

	constructor() {
		this.repository = AppDataSource.getRepository(DeliveryEvents)
	}

	async findById(id: string): Promise<DeliveryEvents | null> {
		return await this.repository.findOneBy({ id })
	}

	async findManyByOrderId(orderId: string): Promise<DeliveryEvents[]> {
		return await this.repository.findBy({ orderId })
	}

	async create(deliveryEvents: DeliveryEvents): Promise<DeliveryEvents> {
		const deliveryEvent = this.repository.create(deliveryEvents)
		return await this.repository.save(deliveryEvent)
	}
}
