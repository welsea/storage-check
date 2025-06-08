import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || '', {
	ssl: 'require', // Heroku requires SSL
  });


export async function initializeDatabase() {
	console.log('⏳ Running DB init...');

	await sql`
	CREATE TABLE IF NOT EXISTS category (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) UNIQUE
	);`;

	await sql`
	CREATE TABLE IF NOT EXISTS items (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) UNIQUE,
		category_id INT NOT NULL DEFAULT 1 REFERENCES category(id)
	);`;

	await sql`
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`;

	await sql`
	CREATE TABLE IF NOT EXISTS locations (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL UNIQUE,
		last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		last_updated_by BIGINT NOT NULL REFERENCES users(id),
		cover VARCHAR(255)
	);`;

	await sql`
	CREATE TABLE IF NOT EXISTS exist_items (
		exist_id SERIAL PRIMARY KEY,
		item_id INT REFERENCES items(id),
		location_id INT REFERENCES locations(id),
		quantity INT NOT NULL DEFAULT 1,
		last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(location_id, item_id)
	);`;

	await sql`
	CREATE TABLE IF NOT EXISTS user_session (
		id TEXT PRIMARY KEY,
		user_id INT NOT NULL REFERENCES users(id),
		expires_at TIMESTAMPTZ NOT NULL
	);`;

	await sql.end();

	console.log('✅ DB init done.');
}
