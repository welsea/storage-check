import * as db from "$lib/server/db";
import * as userDB from "$lib/server/user";
import { fail } from "@sveltejs/kit";

export const load = async ({ params }) => {
	const categories = await db.getCategory(params.slug);
	return {
		location: {
			id: params.slug,
			name: params.name,
		},
		categories,
	};
};
export const actions = {
	edit_category: async ({ request }) => {
		const data = await request.formData();
		const actions = JSON.parse(data.get("events")?.toString() || "[]");
		try {
			for (const action of actions) {
				const item = action.item;
				switch (action.action) {
					case "DELETE":
						await db.deleteCategory(Number(data.get("location_id")), Number(item.id));
						break;
					case "UPDATE":
						await db.updateCategory(Number(data.get("location_id")), item.name, Number(item.id));
						break;
					case "ADD":
						await db.addCategory(Number(data.get("location_id")), item.name);
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
};
