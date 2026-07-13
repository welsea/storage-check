import * as db from "$lib/server/db";
import * as userDB from "$lib/server/user";
import { fail } from "@sveltejs/kit";

export async function load({ params, parent }) {
	const layoutData = await parent();
	const currentLoc = layoutData.locations.filter((e) => e.id == params.slug)[0];
	const data = await db.getList(params.slug);
	const username = await userDB.getUserName(currentLoc.last_updated_by);
	const categories = await db.getCategory(params.slug);
	return {
		location: {
			id: params.slug,
			name: params.name,
			last_updated: new Date(currentLoc.last_updated).toLocaleString("no-NO"),
			last_updated_by: username,
		},
		categories,
		exists: data.exist,
		needs: data.need,
	};
}

export const actions = {
	edit: async ({ request }) => {
		const data = await request.formData();
		const actions = JSON.parse(data.get("events")?.toString() || "[]");
		const location = data.get("location_id");
		try {
			for (const action of actions) {
				const item = action.item;
				switch (action.action) {
					case "DELETE":
						await db.deleteItem(action.target, location, item.id);
						break;
					case "UPDATE":
						await db.updateItem(action.target, location, item.id, item.item_name, item.quantity);
						break;
					case "MOVE":
						await db.moveItem(action.target, location, item.id, item.item_name, item.quantity);
						break;
				}
			}
			await db.updateLocation(Number(location));
		} catch (error: any) {
			return fail(422, {
				error: error.message,
			});
		}
	},
	add_item: async ({ request }) => {
		const data = await request.formData();
		const need = Number(data.get("need"));
		const have = Number(data.get("have"));
		const location = data.get("location_id");
		const item_name = data.get("name");
		const category_id = data.get("category");
		try {
			if (have > 0) {
				await db.addItem("have", location, item_name, category_id, have);
			}

			if (need > 0) {
				await db.addItem("need", location, item_name, category_id, need);
			}
			await db.updateLocation(Number(location));
		} catch (error: any) {
			return fail(422, {
				error: error.message,
			});
		}
	},
	add_category: async ({ request }) => {
		try {
			const data = await request.formData();
			await db.addCategory(data.get("name"));
		} catch (error) {
			console.log(error);
		}
	},
};
