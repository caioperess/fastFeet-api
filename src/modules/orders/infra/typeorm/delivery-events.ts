import { randomUUID } from 'node:crypto'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '@/modules/users/infra/typeorm/entities/user'
import { type DeliveryEventsStatus, EDeliveryEventsStatusEnum } from '../../enums/delivery-events-status-enum'
import { Order } from './orders'

export interface IDeliveryEventsProps {
	orderId: string
	userId: string
	status: DeliveryEventsStatus
	timestamp: Date
	note?: string
}

@Entity('delivery_events')
export class DeliveryEvents {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'enum',
		enum: EDeliveryEventsStatusEnum,
	})
	status: DeliveryEventsStatus

	@Column('timestamp')
	timestamp: Date

	@Column({
		type: 'varchar',
		nullable: true,
	})
	note?: string

	@Column({
		type: 'uuid',
		name: 'order_id',
	})
	@ManyToOne(() => Order)
	orderId: string

	@Column({
		type: 'uuid',
		name: 'user_id',
	})
	@ManyToOne(() => User)
	userId: string

	static create(props: IDeliveryEventsProps, id?: string) {
		const deliveryEvent = new DeliveryEvents(
			{
				...props,
			},
			id,
		)

		return deliveryEvent
	}

	constructor(props: IDeliveryEventsProps, id?: string) {
		this.id = id ?? randomUUID()
		Object.assign(this, props)
	}
}
