import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import type { Item, LocationItem } from './types';

const sql = postgres(DATABASE_URL);

export async function getLocations(): Promise<LocationItem[]> {
	const locations: LocationItem[] = await sql`SELECT * FROM locations`;
	return locations;
}

export async function getCategory() {
	const categories = await sql`SELECT * FROM category`;
	return categories;
}

export async function addLocation(name: string, cover: string, userid: number) {
	if (name === null || name === '') {
		throw new Error("Name shouldn't be empty.");
	}
	try {
		await sql`
            INSERT INTO locations(name,cover,last_updated,last_updated_by)
            VALUES (${name},${cover},${new Date(Date.now())},${userid})
            `;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to add location.');
	}
}

export async function updateLocationCover(id: string, name: string, cover: string, userid: number) {
	if (name === null || name === '') {
		throw new Error("Name shouldn't be empty.");
	}
	try {
		await sql`UPDATE locations SET cover = ${cover}, last_updated = ${new Date(Date.now())},name=${name},last_updated_by=${userid} WHERE id=${id}`;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to add location.');
	}
}

export async function addCategory(name: FormDataEntryValue | null) {
	if (name !== null && name !== '') {
		try {
			await sql`
				INSERT INTO category(name)
				VALUES (${name.toString()})
				`;
		} catch (error) {
			console.log(error);
			throw new Error('Failed to add location.');
		}
	}
}

export async function getList(
	location_id: FormDataEntryValue
): Promise<{ exist: Item[]; need: Item[] }> {
	try {
		let exist: Item[] = await sql`
                SELECT 
					e.*, 
					i.name AS item_name, 
					i.category_id
				FROM exist_items e
				JOIN items i ON e.item_id = i.id
                WHERE e.location_id = ${Number(location_id)};`;
		let need: Item[] = await sql`
                SELECT 
					e.*, 
					i.name AS item_name, 
					i.category_id
				FROM need_items e
				JOIN items i ON e.item_id = i.id
                WHERE e.location_id = ${Number(location_id)}; 
        `;
		exist = exist.sort((a, b) => a.last_updated - b.last_updated);
		need = need.sort((a, b) => a.last_updated - b.last_updated);
		return {
			exist,
			need
		};
	} catch (error) {
		console.log(error);
		throw new Error('Failed to get list.');
	}
}

export async function getAllItems() {
	try {
		const list = await sql`
        SELECT * FROM items 
        `;
		return list;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to get items.');
	}
}

export async function addItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	name: FormDataEntryValue | null,
	category_id: FormDataEntryValue | null,
	quantity: FormDataEntryValue | null
) {
	if (location_id === null || name === null || name === '') {
		throw new Error('Name should not be empty');
	}
	try {
		await sql`
		   WITH upsert_attempt AS (
				INSERT INTO items(name,category_id)
				VALUES (${name.toString()},${Number(category_id)})
				ON CONFLICT(name) DO NOTHING
				RETURNING id
			),
			get_item_id AS (
				SELECT id FROM upsert_attempt
				UNION ALL
				SELECT id FROM items WHERE name = ${name.toString()} AND NOT EXISTS (SELECT 1 FROM upsert_attempt)
			)
			INSERT INTO ${target === 'exist' ? sql('exist_items') : sql('need_items')} (location_id, quantity, item_id)
			SELECT ${Number(location_id)},${Number(quantity)},id FROM get_item_id
			ON CONFLICT (location_id, item_id) DO NOTHING
			RETURNING *;
		`;
	} catch (error) {
		console.log(error);
		throw new Error('Add item failed');
	}
}

export async function deleteItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null
) {
	if (location_id === null || item_id === null) {
		throw new Error('Unable to delete this item.');
	}
	try {
		await sql`
		DELETE FROM ${target === 'exist' ? sql('exist_items') : sql('need_items')} WHERE location_id = ${Number(location_id)} AND item_id=${Number(item_id)}
	`;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to delete a item');
	}
}

export async function updateItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null,
	item_name: FormDataEntryValue | null,
	quantity: FormDataEntryValue | null
) {
	if (location_id === null || item_id === null) {
		throw new Error('Unable to delete this item.');
	}
	try {
		if (item_id === '9999') {
			const ids = await sql`SELECT id FROM items where name = ${item_name!.toString()} `;
			item_id = ids.length > 0 ? ids[0].id : item_id;
		}
		const result = await sql`
		UPDATE ${target === 'exist' ? sql('exist_items') : sql('need_items')} SET quantity = ${Number(quantity)} WHERE location_id = ${Number(location_id)} AND item_id=${Number(item_id)}
	`;
		console.log(result);
	} catch (error) {
		console.log(error);
		throw new Error('Failed to delete a item');
	}
}

export async function updateLocation(userid: number, location_id: number) {
	await sql`UPDATE locations SET last_updated_by = ${userid}, last_updated = ${new Date(Date.now())} WHERE id=${location_id}`;
}
