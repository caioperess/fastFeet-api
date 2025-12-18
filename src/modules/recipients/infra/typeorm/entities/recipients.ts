import { randomUUID } from 'node:crypto'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export interface IRecipientsProps {
	name: string
	neighborhood: string
	email: string
	city: string
	state: string
	zipCode: string
	number: string
	complement?: string
	latitude: number
	longitude: number
}

@Entity('recipients')
export class Recipient {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('varchar')
	name: string

	@Column({ type: 'varchar', unique: true })
	email: string

	@Column('varchar')
	neighborhood: string

	@Column('varchar')
	city: string

	@Column({
		type: 'varchar',
		length: 2,
	})
	state: string

	@Column({
		type: 'varchar',
		length: 10,
	})
	zipCode: string

	@Column('varchar')
	number: string

	@Column('varchar')
	complement?: string

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 8,
	})
	latitude: number

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 8,
	})
	longitude: number

	static create(props: IRecipientsProps, id?: string) {
		return new Recipient(props, id)
	}

	constructor(props: IRecipientsProps, id?: string) {
		this.id = id ?? randomUUID()
		Object.assign(this, props)
	}
}
