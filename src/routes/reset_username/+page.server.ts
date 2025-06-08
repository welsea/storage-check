import { redirect, fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		try {
			const result = await auth.reset_username(data.get('username'), event.locals.user!.id);
			if (result && result.valid) {
				await auth.logout(event);
				throw redirect(303, '/login');
			}

			return fail(403, {
				incorrect: true,
				error: result.message
			});
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	}
};
