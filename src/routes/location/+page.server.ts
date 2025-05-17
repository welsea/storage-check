import * as db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { join } from 'path';
import sharp from 'sharp';

async function handleImage(image: File, name: string) {
	const UPLOAD_DIR = 'static/covers';
	const buffer = Buffer.from(await image.arrayBuffer());

	// Generate unique filename
	const filename = `${name}_cover.webp`;
	const filePath = join(UPLOAD_DIR, filename);
	const publicPath = `/covers/${filename}`;
	// Process with sharp and convert to WebP
	await sharp(buffer)
		.resize(800) // Optional: resize to max width
		.webp({ quality: 80 })
		.toFile(filePath);

	return publicPath;
}

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		try {
			const image = data.get('image') as File | null;
			const name = data.get('name') as string;
			const userid = locals.user!.id;

			if (!image || !image.type.startsWith('image/')) {
				return fail(400, { error: 'Please upload a valid image' });
			}
			const publicPath = await handleImage(image, name);

			await db.addLocation(name, publicPath, userid);
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	},
	edit: async ({ request, locals }) => {
		const data = await request.formData();
		try {
			const image = data.get('image') as File | null;
			const name = data.get('name') as string;
			const id = data.get('id') as string;
			const userid = locals.user!.id;

			if (!image || !image.type.startsWith('image/')) {
				return fail(400, { error: 'Please upload a valid image' });
			}
			const publicPath = await handleImage(image, name);
			await db.updateLocationCover(id, name, publicPath,userid);
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	}
};
