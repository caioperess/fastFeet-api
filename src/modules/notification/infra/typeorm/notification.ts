import { Order } from '@/modules/orders/infra/typeorm/orders'
import { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import { randomUUID } from 'node:crypto'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

export interface INotificationProps {
	recipientId: string
	orderId: string
	message: string
	sentAt: Date
}

@Entity('notifications')
export class Notifications {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('varchar')
	message: string

	@Column({
		type: 'timestamp',
		name: 'sent_at',
	})
	sentAt: string

	@Column({
		type: 'uuid',
		name: 'recipient_id',
	})
	recipientId: string

	@ManyToOne(() => Recipient)
	recipient: Recipient

	@Column({
		type: 'uuid',
		name: 'order_id',
	})
	orderId: string

	@ManyToOne(() => Order)
	order: Order

	static create(props: INotificationProps, id?: string) {
		const notification = new Notifications(
			{
				...props,
			},
			id,
		)

		return notification
	}

	constructor(props: INotificationProps, id?: string) {
		this.id = id ?? randomUUID()
		Object.assign(this, props)
	}
}
