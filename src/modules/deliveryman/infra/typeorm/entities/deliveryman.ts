import { Order } from '@/modules/orders/infra/typeorm/orders'
import { EUserRole } from '@/modules/users/enums/role-enum'
import { User } from '@/modules/users/infra/typeorm/entities/user'
import { ChildEntity, OneToMany } from 'typeorm'

@ChildEntity(EUserRole.DELIVERYMAN)
export class Deliveryman extends User {
	@OneToMany(
		() => Order,
		(order) => order.deliverymanId,
	)
	orders: Order[]
}
