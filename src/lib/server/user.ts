import postgres from 'postgres';
import { DATABASE_URL as PRIVATE_DATABASE_URL } from '$env/static/private';

const databaseUrl = process.env.DATABASE_URL ?? PRIVATE_DATABASE_URL;
const sql = postgres(databaseUrl, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});


export async function getUserName(id: FormDataEntryValue | null) {
	if (id === null || id === '') {
		return '????';
	}
	const username = await sql`SELECT username FROM users WHERE id=${id.toString()}`;
	return username[0].username;
}
