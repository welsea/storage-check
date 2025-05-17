// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const dbExist = new Map();
const dbNeed = new Map();

export function getExist(locationId: string) {
	if (!dbExist.get(locationId)) {
		dbExist.set(locationId, [
			{
				id: crypto.randomUUID(),
				name: 'sugar',
				quantity: 1,
				done: false
			}
		]);
	}

	return dbExist.get(locationId);
}

export function getNeed(locationId: string) {
	if (!dbNeed.get(locationId)) {
		dbNeed.set(locationId, [
			{
				id: crypto.randomUUID(),
				name: 'sugar',
				quantity: 1,
				done: false
			}
		]);
	}

	return dbNeed.get(locationId);
}

export function createItem(
	type: FormDataEntryValue | null,
	locationId: FormDataEntryValue | null,
	name: FormDataEntryValue | null
) {
	const db = type === 'exist' ? dbExist : dbNeed;
	const items = db.get(String(locationId));
	if (name === '') {
		throw new Error('Item name should not be empty');
	}
	items.push({
		id: crypto.randomUUID(),
		name,
		quantity: 1,
		done: false
	});
}

export function addQuantity(
	type: FormDataEntryValue | null,
	locationId: FormDataEntryValue | null,
	itemId: FormDataEntryValue | null,
	quantity: FormDataEntryValue | null
) {
	const db = type === 'exist' ? dbExist : dbNeed;
	const items = db.get(String(locationId));
	items.forEach((item: any) => {
		if (item.id === itemId) {
			if (quantity && parseFloat(quantity.toString()) > 0) {
				item.quantity = quantity;
			} else {
				throw new Error('Quantity needs to be bigger than 0');
			}
		}
	});
}

export function deleteTodo(
	type: FormDataEntryValue | null,
	locationId: FormDataEntryValue | null,
	itemId: FormDataEntryValue | null
) {
	const db = type === 'exist' ? dbExist : dbNeed;
	const items = db.get(String(locationId));
	if (items) {
		const index = items.findIndex((todo: any) => todo.id === itemId);
		if (index !== -1) {
			items.splice(index, 1);
		}
	} else {
		return;
	}
}
