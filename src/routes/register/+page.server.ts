import { redirect, fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const result = await auth.register(data.get('code'),data.get('username'), data.get('password'));
		if (result && result.valid) {
			redirect(303, '/login');
		}

		return fail(403, {
			incorrect: true,
			error: result.message
		});
	}
};
