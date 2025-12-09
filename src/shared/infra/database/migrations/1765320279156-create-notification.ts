import { type MigrationInterface, type QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateNotification1765320279156 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'notifications',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'message',
						type: 'varchar',
					},
					{
						name: 'sent_at',
						type: 'timestamp',
					},
					{
						name: 'recipient_id',
						type: 'uuid',
					},
					{
						name: 'order_id',
						type: 'uuid',
					},
				],
			}),
		)

		await queryRunner.createForeignKey(
			'notifications',
			new TableForeignKey({
				columnNames: ['recipient_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'recipients',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		)

		await queryRunner.createForeignKey(
			'notifications',
			new TableForeignKey({
				columnNames: ['order_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'orders',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('notifications')
	}
}
