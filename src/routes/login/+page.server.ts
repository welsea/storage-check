import { redirect, fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { PageServerLoad } from './$types';



export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const result = await auth.login(event, data.get('username'), data.get('password'));
		if (result && result.valid) {
			redirect(303, '/location');
		}

		return fail(403, {
			incorrect: true,
			error: result.message
		});
	}
};
