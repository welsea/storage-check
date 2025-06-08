import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	logout: async (event) => {
		await auth.logout(event);
		redirect(302, '/login');
	}
};
