import { type MigrationInterface, type QueryRunner, Table } from 'typeorm'

export class CreateRecipient1765320232371 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'recipients',
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
						name: 'neighborhood',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'city',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'state',
						type: 'varchar',
						length: '2',
						isNullable: false,
					},
					{
						name: 'zipCode',
						type: 'varchar',
						length: '10',
						isNullable: false,
					},
					{
						name: 'number',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'complement',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'latitude',
						type: 'decimal',
						precision: 10,
						scale: 8,
						isNullable: false,
					},
					{
						name: 'longitude',
						type: 'decimal',
						precision: 10,
						scale: 8,
						isNullable: false,
					},
				],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('recipients')
	}
}
