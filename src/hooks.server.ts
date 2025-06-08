// src/hooks.server.ts
import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from './lib/server/session';
import { redirect } from '@sveltejs/kit';

import type { Handle } from '@sveltejs/kit';

const publicPaths = ['/login', '/register', '/reset_password'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	const path = event.url.pathname;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		if (!publicPaths.some((p) => path.startsWith(p))) {
			throw redirect(302, '/login');
		}
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	if (!user && !publicPaths.some((p) => path.startsWith(p))) {
		throw redirect(302, '/login');
	}

	return resolve(event);
};
