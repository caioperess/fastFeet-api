import { DataSource } from 'typeorm'

const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'fastfeet',
	password: 'fastfeet',
	database: 'fastfeet',
	entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
	migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
})

async function initializeDataSource() {
	try {
		await AppDataSource.initialize()
	} catch (err) {
		console.error('Error initializing database:', err)
	}
}

export { AppDataSource, initializeDataSource }
