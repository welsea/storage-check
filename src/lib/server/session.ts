/**
 * tutorial: https://lucia-auth.com/sessions/cookies/sveltekit
 * 			 https://lucia-auth.com/sessions/basic-api/postgresql
 */

import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { RequestEvent } from '@sveltejs/kit';

const sql = postgres(process.env.DATABASE_URL || '', {
	ssl: 'require', // Heroku requires SSL
  });

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		secure:true,
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		secure:true,
		maxAge: 0,
		path: '/'
	});
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await sql`INSERT INTO user_session (id, user_id, expires_at) VALUES (${session.id}, ${session.userId}, ${session.expiresAt})`;
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await sql`
        SELECT user_session.id as session_id, user_session.user_id, user_session.expires_at, users.id, users.username FROM user_session INNER JOIN users ON users.id = user_session.user_id WHERE user_session.id = ${sessionId}
    `;
	if (row === null || row.length === 0) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: row[0].session_id,
		userId: row[0].userId,
		expiresAt: row[0].expires_at
	};
	const user: User = {
		id: row[0].id,
		name: row[0].username
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await sql`DELETE FROM user_session WHERE id = ${session.id}`;
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await sql`UPDATE user_session SET expires_at = ${session.expiresAt} WHERE id =${session.id}?`;
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await sql`DELETE FROM user_session WHERE id = ${sessionId}`;
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	await sql`DELETE FROM user_session WHERE user_id = ${userId}`;
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

export interface User {
	id: number;
	name: string;
}
