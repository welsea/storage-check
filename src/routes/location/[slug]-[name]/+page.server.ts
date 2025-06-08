import * as db from '$lib/server/db';
import * as userDB from '$lib/server/user';
import { fail } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const layoutData = await parent();
	console.log(params.slug)
	console.log(layoutData.locations)
	console.log(layoutData.locations[0].id)
	const currentLoc = layoutData.locations.filter((e) => e.id === params.slug)[0];
	console.log(currentLoc)
	const data = await db.getList(params.slug);
	console.log(data)
	const username = await userDB.getUserName(currentLoc.last_updated_by);
	const categories = await db.getCategory();
	return {
		location: {
			id: params.slug,
			name: params.name,
			last_updated: new Date(currentLoc.last_updated).toLocaleString('no-NO'),
			last_updated_by: username
		},
		categories,
		exists: data.exist,
		needs: data.need
	};
}

export const actions = {
	edit: async ({ request }) => {
		const data = await request.formData();
		const actions = JSON.parse(data.get('events')?.toString() || '[]');
		const location = data.get('location_id');
		const user = data.get('user_id');
		try {
			for (const action of actions) {
				const item = action.item;
				switch (action.action) {
					case 'ADD':
						await db.addItem(
							action.target,
							location,
							item.item_name,
							item.category_id,
							item.quantity
						);
						break;
					case 'DELETE':
						await db.deleteItem(action.target, location, item.item_id);
						break;
					case 'UPDATE':
						await db.updateItem(
							action.target,
							location,
							item.item_id,
							item.item_name,
							item.quantity
						);
						break;
				}
			}
			await db.updateLocation(Number(user), Number(location));
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	},
	add_category: async ({ request }) => {
		try {
			const data = await request.formData();
			await db.addCategory(data.get('name'));
		} catch (error) {
			console.log(error);
		}
	}
};
