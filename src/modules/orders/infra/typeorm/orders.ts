import { Deliveryman } from '@/modules/deliveryman/infra/typeorm/entities/deliveryman'
import { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import type { Optional } from '@/types/optional'
import { randomUUID } from 'node:crypto'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { EOrderStatusEnum, type OrderStatus } from '../../enums/status-enum'
import { DeliveryEvents } from './delivery-events'

export interface IOrdersProps {
	status: OrderStatus
	productName: string
	recipientId: string
	deliverymanId?: string
	deliveryPhotoId?: string
	withdrawnAt?: Date
	returnedAt?: Date
	deliveredAt?: Date
	createdAt: Date
	updatedAt: Date
}

@Entity('orders')
export class Order {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'enum',
		enum: EOrderStatusEnum,
		default: EOrderStatusEnum.PENDING,
	})
	status: OrderStatus

	@Column({ type: 'varchar', name: 'product_name' })
	productName: string

	@Column({ type: 'timestamp', name: 'withdrawn_at', nullable: true })
	withdrawnAt?: Date

	@Column({ type: 'timestamp', name: 'delivered_at', nullable: true })
	deliveredAt?: Date

	@Column({ type: 'timestamp', name: 'returned_at', nullable: true })
	returnedAt?: Date

	@Column({ type: 'varchar', name: 'delivery_photo_id', nullable: true })
	deliveryPhotoId?: string

	@Column({ type: 'varchar', name: 'recipient_id' })
	recipientId: string

	@ManyToOne(
		() => Recipient,
		(recipient) => recipient.orders,
	)
	recipient: Recipient

	@Column({ type: 'varchar', name: 'deliveryman_id', nullable: true })
	deliverymanId?: string

	@ManyToOne(
		() => Deliveryman,
		(deliveryman) => deliveryman.orders,
	)
	deliveryman: Deliveryman

	@OneToMany(
		() => DeliveryEvents,
		(deliveryEvents) => deliveryEvents.orderId,
	)
	events: DeliveryEvents[]

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	static create(props: Optional<IOrdersProps, 'createdAt' | 'updatedAt'>, id?: string) {
		const order = new Order(
			{
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
				...props,
			},
			id,
		)

		return order
	}

	constructor(props: IOrdersProps, id?: string) {
		this.id = id ?? randomUUID()
		Object.assign(this, props)
	}
}
