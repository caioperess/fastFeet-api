import { faker } from '@faker-js/faker'
import { EOrderStatusEnum } from '@/modules/orders/enums/status-enum'
import { Order } from '@/modules/orders/infra/typeorm/orders'

export function makeOrder(override?: Partial<Order>, id?: string) {
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
