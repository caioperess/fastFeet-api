import { type MigrationInterface, type QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateDeliveryEvents1765320273484 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'delivery_events',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'status',
						type: 'enum',
						enum: ['CREATED', 'AVAILABLE', 'WITHDRAWN', 'DELIVERED', 'RETURNED'],
					},
					{
						name: 'timestamp',
						type: 'timestamp',
					},
					{
						name: 'note',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'order_id',
						type: 'uuid',
					},
					{
						name: 'user_id',
						type: 'uuid',
					},
				],
			}),
		)

		await queryRunner.createForeignKey(
			'delivery_events',
			new TableForeignKey({
				columnNames: ['order_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'orders',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		)

		await queryRunner.createForeignKey(
			'delivery_events',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('delivery_events')
	}
}
