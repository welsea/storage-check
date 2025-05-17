import * as db from '$lib/server/db';

export async function load() {
	const locations = await db.getLocations()
	return {
		locations
	};
}