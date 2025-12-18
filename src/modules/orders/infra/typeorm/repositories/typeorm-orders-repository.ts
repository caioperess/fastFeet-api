import { searchOrderRadiusInKm } from '@/config/search-order-radius'
import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import type {
	FindNearbyOrdersByDeliverymanParams,
	OrdersRepository,
} from '@/modules/orders/repositories/orders-repository'
import { AppDataSource } from '@/shared/infra/database'
import type { Repository } from 'typeorm'
import { Order } from '../entities/orders'

export class TypeormOrdersRepository implements OrdersRepository {
	private readonly repository: Repository<Order>

	constructor() {
		this.repository = AppDataSource.getRepository(Order)
	}

	async create(data: Order): Promise<Order> {
		const order = this.repository.create(data)
		return await this.repository.save(order)
	}

	async save(data: Order): Promise<Order> {
		return await this.repository.save(data)
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id)
	}

	async findById(id: string): Promise<Order | null> {
		return await this.repository.findOneBy({ id })
	}

	async findByDeliverymanId(deliverymanId: string): Promise<Order[]> {
		return await this.repository.find({ where: { deliverymanId } })
	}

	async findNearbyOrdersByDeliveryman({
		deliverymanId,
		latitude,
		longitude,
	}: FindNearbyOrdersByDeliverymanParams): Promise<Order[]> {
		const orders = await this.repository
			.createQueryBuilder('order')
			.innerJoin('order.recipientId', 'recipient')
			.where('order.status = :status', { status: EOrderStatusEnum.PENDING })
			.andWhere('order.deliverymanId = :deliverymanId', { deliverymanId })
			.addSelect(
				`6371 * acos(
          cos(radians(:lat)) * cos(radians(recipient.latitude)) * cos(radians(recipient.longitude) - radians(:long)) + 
          sin(radians(:lat)) * sin(radians(recipient.latitude))
        )`,
				'distance',
			)
			.having('distance <= :dist', { dist: searchOrderRadiusInKm })
			.setParameters({
				lat: latitude,
				long: longitude,
			})
			.orderBy('distance', 'ASC')
			.getMany()

		return orders
	}
}
