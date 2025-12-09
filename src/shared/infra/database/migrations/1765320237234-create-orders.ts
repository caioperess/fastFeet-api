import { type MigrationInterface, type QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateOrders1765320237234 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'orders',
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
						enum: ['PENDING', 'AVAILABLE', 'WITHDRAWN', 'DELIVERED', 'RETURNED'],
						default: "'PENDING'",
					},
					{
						name: 'product_name',
						type: 'varchar',
					},
					{
						name: 'withdrawn_at',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'delivered_at',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'returned_at',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'delivery_photo_id',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'recipient_id',
						type: 'uuid',
					},
					{
						name: 'deliveryman_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'now()',
					},
				],
			}),
		)

		await queryRunner.createForeignKey(
			'orders',
			new TableForeignKey({
				columnNames: ['recipient_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'recipients',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		)

		await queryRunner.createForeignKey(
			'orders',
			new TableForeignKey({
				columnNames: ['deliveryman_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('orders')
	}
}
