import { type MigrationInterface, type QueryRunner, Table } from 'typeorm'

export class CreateUsers1765233304871 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'cpf',
						type: 'varchar',
						isUnique: true,
						isNullable: false,
					},
					{
						name: 'phone',
						type: 'varchar',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'role',
						type: 'enum',
						enum: ['ADMIN', 'DELIVERYMAN'],
						isNullable: false,
					},
					{
						name: 'password_hash',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
				],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users')
	}
}
