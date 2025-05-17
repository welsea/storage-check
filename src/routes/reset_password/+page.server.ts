import { redirect, fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user !== null) {
		return {
			login: true
		};
	}
	return {
		login: false
	};
};

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const logged = event.locals.user !== null;
		const result = await auth.reset_password(
            logged,
			data.get('code'),
			data.get('username'),
			data.get('password')
		);
		if (result && result.valid) {
			await auth.logout(event)
			redirect(303, '/login');
		}

		return fail(403, {
			incorrect: true,
			error: result.message
		});
	}
};
