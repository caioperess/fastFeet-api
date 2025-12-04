import { randomUUID } from 'node:crypto'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Recipient } from '@/modules/recipients/infra/typeorm/entities/recipients'
import { User } from '@/modules/users/infra/typeorm/entities/user'
import type { Optional } from '@/types/optional'
import { EOrderStatusEnum } from '../../enums/status-enum'

export interface IOrdersProps {
	status: EOrderStatusEnum
	productName: string
	recipientId: string
	deliverymanId?: string
	deliveryPhotoId: string
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
	status: EOrderStatusEnum

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
	@OneToOne(() => Recipient)
	@JoinColumn()
	recipientId: string

	@Column({ type: 'varchar', name: 'deliveryman_id', nullable: true })
	@OneToOne(() => User)
	@JoinColumn()
	deliverymanId?: string

	@Column({ type: 'timestamp', name: 'created_at' })
	createdAt: Date

	@Column({ type: 'timestamp', name: 'updated_at' })
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
