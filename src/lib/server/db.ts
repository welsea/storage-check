import postgres from "postgres";
import type { CategoryItem, Item, LocationItem } from "./types";
import { DATABASE_URL as PRIVATE_DATABASE_URL } from "$env/static/private";

const databaseUrl = process.env.DATABASE_URL ?? PRIVATE_DATABASE_URL;
const sql = postgres(databaseUrl, {
	ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export async function getLocations(): Promise<LocationItem[]> {
	const locations: LocationItem[] = await sql`SELECT * FROM locations`;
	return locations;
}

// Category now belongs to a location, so this needs a location_id.
export async function getCategory(location_id: FormDataEntryValue | number): Promise<CategoryItem[]> {
	const categories: CategoryItem[] = await sql`
		SELECT * FROM category WHERE location_id = ${Number(location_id)}
	`;
	return categories;
}

export async function addLocation(name: string, cover: string, userid: number) {
	if (name === null || name === "") {
		throw new Error("Name shouldn't be empty.");
	}
	try {
		await sql`
            INSERT INTO locations(name,cover,last_updated,last_updated_by)
            VALUES (${name},${cover},${new Date(Date.now())},${userid})
            `;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to add location.");
	}
}

export async function updateLocationCover(id: string, name: string, cover: string, userid: number) {
	if (name === null || name === "") {
		throw new Error("Name shouldn't be empty.");
	}
	try {
		await sql`UPDATE locations SET cover = ${cover}, last_updated = ${new Date(Date.now())},name=${name},last_updated_by=${userid} WHERE id=${id}`;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to add location.");
	}
}

// Category also needs a location_id now.
export async function addCategory(location_id: Number | null, name: string | null) {
	if (location_id === null) {
		throw new Error("Location is required.");
	}
	if (name !== null && name !== "") {
		try {
			await sql`
				INSERT INTO category(location_id, name)
				VALUES (${Number(location_id)}, ${name.toString()})
				ON CONFLICT (location_id, name) DO NOTHING
				`;
		} catch (error) {
			console.log(error);
			throw new Error("Failed to add category.");
		}
	}
}

export async function deleteCategory(location_id: number | null, id: number | null) {
	if (location_id === null) {
		throw new Error("Location is required.");
	}
	if (id !== null) {
		try {
			await sql`
			DELETE FROM category
			WHERE id = ${Number(id)}
			  AND location_id = ${Number(location_id)}
		`;
		} catch (error) {
			console.log(error);
			throw new Error("Failed to delete category.");
		}
	}
}

export async function updateCategory(location_id: number | null, name: string | null, id: Number | null) {
	if (location_id === null) {
		throw new Error("Location is required.");
	}
	if (id !== null) {
		try {
			await sql`
			UPDATE category
			SET name = ${name}
			WHERE id = ${Number(id)}
			  AND location_id = ${Number(location_id)}
		`;
		} catch (error) {
			console.log(error);
			throw new Error("Failed to delete category.");
		}
	}
}

// No more join to a separate items table with exist_items/need_items —
// items now carry location_id, category_id, and is_need directly.
export async function getList(location_id: FormDataEntryValue): Promise<{ exist: Item[]; need: Item[] }> {
	try {
		let exist: Item[] = await sql`
			SELECT * FROM items
			WHERE location_id = ${Number(location_id)} AND is_need = FALSE;
		`;
		let need: Item[] = await sql`
			SELECT * FROM items
			WHERE location_id = ${Number(location_id)} AND is_need = TRUE;
		`;
		exist = exist.sort((a, b) => a.last_updated - b.last_updated);
		need = need.sort((a, b) => a.last_updated - b.last_updated);
		return {
			exist,
			need,
		};
	} catch (error) {
		console.log(error);
		throw new Error("Failed to get list.");
	}
}

// Renamed conceptually from getAllItems -> items are per-location now, not global.
export async function getItems(location_id: FormDataEntryValue) {
	try {
		const list = await sql`
			SELECT * FROM items WHERE location_id = ${Number(location_id)}
		`;
		return list;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to get items.");
	}
}

// Items are unique per (location_id, name, is_need) — no more global items
// table + separate exist/need join tables. One insert does it all.
export async function addItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	name: FormDataEntryValue | null,
	category_id: FormDataEntryValue | null,
	quantity: FormDataEntryValue | number,
) {
	if (location_id === null || name === null || name === "") {
		throw new Error("Name should not be empty");
	}
	const is_need = target === "need";
	try {
		await sql`
			INSERT INTO items (location_id, category_id, name, quantity, is_need, last_updated)
			VALUES (
				${Number(location_id)},
				${Number(category_id)},
				${name.toString()},
				${Number(quantity)},
				${is_need},
				${new Date(Date.now())}
			)
			ON CONFLICT (location_id, name, is_need) DO NOTHING
			RETURNING *;
		`;
	} catch (error) {
		console.log(error);
		throw new Error("Add item failed");
	}
}

// item_id is now the items.id directly — no item_id/location_id pair needed
// on a separate join table, but we still scope by location_id for safety.
export async function deleteItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null,
) {
	if (location_id === null || item_id === null) {
		throw new Error("Unable to delete this item.");
	}
	const is_need = target === "need";
	try {
		await sql`
			DELETE FROM items
			WHERE id = ${Number(item_id)}
			  AND location_id = ${Number(location_id)}
			  AND is_need = ${is_need}
		`;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to delete a item");
	}
}

export async function updateItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null,
	item_name: FormDataEntryValue | null,
	quantity: FormDataEntryValue | null,
) {
	if (location_id === null || item_id === null) {
		throw new Error("Unable to update this item.");
	}
	const is_need = target === "need";
	try {
		if (item_id === "9999") {
			const ids = await sql`
				SELECT id FROM items
				WHERE name = ${item_name!.toString()}
				  AND location_id = ${Number(location_id)}
				  AND is_need = ${is_need}
			`;
			item_id = ids.length > 0 ? ids[0].id : item_id;
		}
		const result = await sql`
			UPDATE items
			SET quantity = ${Number(quantity)}, last_updated = ${new Date(Date.now())}
			WHERE id = ${Number(item_id)}
			  AND location_id = ${Number(location_id)}
			  AND is_need = ${is_need}
		`;
		console.log(result);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update a item");
	}
}

export async function moveItem(
	target: FormDataEntryValue | null,
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null,
	item_name: FormDataEntryValue | null,
	quantity: FormDataEntryValue | null,
) {
	if (location_id === null || item_id === null) {
		throw new Error("Unable to move this item.");
	}
	const is_need = target === "need";
	try {
		console.log(`
			UPDATE items
			SET is_need = ${is_need}, last_updated = ${new Date(Date.now())}
			WHERE id = ${Number(item_id)}
			  AND location_id = ${Number(location_id)}
			  AND is_need = ${!is_need}
		`);
		const result = await sql`
			UPDATE items
			SET is_need = ${is_need}, last_updated = ${new Date(Date.now())}
			WHERE id = ${Number(item_id)}
			  AND location_id = ${Number(location_id)}
			  AND is_need = ${!is_need}
		`;
		console.log(result);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to update a item");
	}
}
// New: moving an item to a different category is just this — no delete/re-insert
// required, since category_id isn't part of the uniqueness constraint.
export async function updateItemCategory(
	location_id: FormDataEntryValue | null,
	item_id: FormDataEntryValue | null,
	category_id: FormDataEntryValue | null,
) {
	if (location_id === null || item_id === null || category_id === null) {
		throw new Error("Unable to move this item.");
	}
	try {
		await sql`
			UPDATE items
			SET category_id = ${Number(category_id)}, last_updated = ${new Date(Date.now())}
			WHERE id = ${Number(item_id)} AND location_id = ${Number(location_id)}
		`;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to move item to new category");
	}
}

export async function updateLocation(location_id: number) {
	await sql`UPDATE locations SET last_updated = ${new Date(Date.now())} WHERE id=${location_id}`;
}
