import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import { type IOrdersProps, Order } from '@/modules/orders/infra/typeorm/entities/orders'
import { faker } from '@faker-js/faker'

export function makeOrder(override?: Partial<IOrdersProps>, id?: string) {
	const order = Order.create(
		{
			productName: faker.lorem.word(),
			recipientId: faker.string.uuid(),
			status: EOrderStatusEnum.PENDING,
			...override,
		},
		id,
	)

	return order
}
