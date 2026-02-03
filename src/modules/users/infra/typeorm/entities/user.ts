import { EUserRole } from '@/modules/users/enums/role-enum'
import { randomUUID } from 'node:crypto'
import { Column, Entity, Index, PrimaryGeneratedColumn, TableInheritance } from 'typeorm'

export interface IUserProps {
	name: string
	cpf: string
	passwordHash: string
	role: EUserRole
	phone: string
}

@Entity('users')
@TableInheritance({ column: { name: 'role', type: 'enum', enum: EUserRole } })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('varchar')
	name: string

	@Column('varchar')
	@Index(['cpf'], { unique: true })
	cpf: string

	@Column({
		name: 'password_hash',
		type: 'varchar',
		length: 255,
	})
	passwordHash: string

	@Column({
		type: 'enum',
		enum: EUserRole,
	})
	role: EUserRole

	@Column('varchar')
	phone: string

	static create(props: IUserProps, id?: string) {
		return new User(props, id)
	}

	constructor(props: IUserProps, id?: string) {
		this.id = id ?? randomUUID()
		Object.assign(this, props)
	}
}
