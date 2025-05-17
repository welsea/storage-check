import { genSalt, hash, compare } from 'bcrypt-ts';
import * as userSession from '$lib/server/session';
import type { RequestEvent } from '@sveltejs/kit';
import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';

const sql = postgres(POSTGRES_URL);

export async function register(
	code: FormDataEntryValue | null,
	username: FormDataEntryValue | null,
	pass: FormDataEntryValue | null
) {
	if (code === null || code === '') {
		return {
			valid: false,
			message: "Invitation code doesn't exist."
		};
	}
	if (code.toString() !== 'hello_cabin') {
		return {
			valid: false,
			message: "Invitation code doesn't exist."
		};
	}
	if (pass === null || pass === '' || username === null || username === '') {
		return {
			valid: false,
			message: 'Username or password cannot be empty.'
		};
	}

	const user = await sql`SELECT * FROM users WHERE username = ${username.toString()}`;
	if (user.length > 0) {
		return {
			valid: false,
			message: 'Username should be unique.'
		};
	}

	pass = pass.toString();
	username = username.toString();
	try {
		const salt = await genSalt(10);
		const result = await hash(pass, salt);
		await sql`
				INSERT INTO users(username,password)
				VALUES(${username},${result})
		`;
		return {
			valid: true
		};
	} catch (error) {
		return {
			valid: false,
			message: 'Unable to register.'
		};
	}
}

export async function login(
	event: RequestEvent,
	username: FormDataEntryValue | null,
	password: FormDataEntryValue | null
) {
	try {
		if (username === null || password === null || username === '' || password === '') {
			throw new Error('Username/password should not be empty');
		}
		const user = await sql`
        SELECT * FROM users WHERE username = ${username.toString()}`;

		if (user.length === 0) {
			return {
				valid: false,
				message: "User doesn't exist"
			};
		}

		const isValid = await compare(password.toString(), user[0].password);

		if (!isValid) {
			return {
				valid: false,
				message: "Password doesn't match with username"
			};
		}

		const token = userSession.generateSessionToken();
		const session = await userSession.createSession(token, user[0].id);

		userSession.setSessionTokenCookie(event, token, session.expiresAt);
		const data = {
			valid: isValid,
			username: username.toString(),
			userid: user[0].id
		};
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Login failed.');
	}
}

export async function logout(event: RequestEvent) {
	// Remove cookie
	userSession.deleteSessionTokenCookie(event);
}

export async function reset_password(
	logged: boolean,
	code: FormDataEntryValue | null,
	username: FormDataEntryValue | null,
	pass: FormDataEntryValue | null
) {
	if (!logged) {
		// not logged in, need code
		if (code === null || code === '' || code !== 'IWANTTORESETPLEASE') {
			return {
				valid: false,
				message: 'WRONG WORD.'
			};
		}
	}

	if (username === null || username === '' || pass === null || pass === '') {
		return {
			valid: false,
			message: 'Empty value is not gonna work'
		};
	}

	pass = pass.toString();
	username = username.toString();

	const user = await sql`
	SELECT * FROM users WHERE username = ${username.toString()}`;

	if (user.length === 0) {
		return {
			valid: false,
			message: "User doesn't exist"
		};
	}

	try {
		const salt = await genSalt(10);
		const result = await hash(pass, salt);
		await sql`
				UPDATE users SET password=${result} WHERE username = ${username}
		`;
		return {
			valid: true
		};
	} catch (error) {
		return {
			valid: false,
			message: 'Unable to reset password.'
		};
	}
}

export async function reset_username(username: FormDataEntryValue | null, user_id: number) {
	if (username === null || username === '') {
		return {
			valid: false,
			message: 'Username should not be empty.'
		};
	}
	username = username.toString();
	try {
		await sql`
				UPDATE users SET username=${username} WHERE id = ${user_id}
		`;
		return {
			valid: true
		};
	} catch (error) {
		return {
			valid: false,
			message: 'Unable to reset username.'
		};
	}
}
