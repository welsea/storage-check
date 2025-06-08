import { json } from '@sveltejs/kit';
import { initializeDatabase } from '$lib/init_db';

// OPTIONAL: Very basic protection — only allow in dev
const isDev = process.env.NODE_ENV === 'development';

export async function GET() {
	// if (!isDev) {
	// 	console.log('not dev')
	// 	return new Response('Not allowed in production', { status: 403 });
	// }

	try {
		await initializeDatabase();
		return json({ success: true, message: 'Database initialized' });
	} catch (err) {
		console.error('DB init failed:', err);
		return json({ success: false, error: String(err) }, { status: 500 });
	}
}
