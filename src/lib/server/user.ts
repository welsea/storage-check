import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import type { Item } from './types';

const sql = postgres(DATABASE_URL);

export async function getUserName(id: FormDataEntryValue | null) {
	if (id === null || id === '') {
		return '????';
	}
	const username = await sql`SELECT username FROM users WHERE id=${id.toString()}`;
	return username[0].username;
}
