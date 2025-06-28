import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import sharp from "sharp";
import { uploadImageToS3 } from "$lib/server/s3.js";
import type { Actions } from "./$types";

export async function load() {
    const locations = await db.getLocations()
    return {
        locations
    };
}

async function handleImage(image: File, name: string) {
	const arrayBuffer = await image.arrayBuffer();
	const nodeBuffer = Buffer.from(arrayBuffer);
	const processedImageBuffer = await sharp(nodeBuffer).rotate().resize(800).webp({ quality: 80 }).toBuffer();
	const result = await uploadImageToS3(processedImageBuffer, name);
	return result;
}

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const image = data.get("image") as File | null;
		const name = data.get("name") as string;
		const userid = locals.user!.id;

		if (!image || !image.type.startsWith("image/")) {
			return fail(400, { error: "Please upload a valid image" });
		}
		const filename = `${name}_cover.webp`;
		const result = await handleImage(image, filename);

		if (result) {
			await db.addLocation(name, filename, userid);
			return { success: true };
		} else {
			return fail(422, {
				error: "Add location failed!",
			});
		}
	},
	edit: async ({ request, locals }) => {
		const data = await request.formData();
		const image = data.get("image") as File | null;
		const name = data.get("name") as string;
		const id = data.get("id") as string;
		const userid = locals.user!.id;

		if (!image || !image.type.startsWith("image/")) {
			return fail(400, { error: "Please upload a valid image" });
		}
		const filename = `${name}_cover.webp`;
		const result = await handleImage(image, filename);
		if (result) {
			await db.updateLocationCover(id, name, filename, userid);
			return { success: true };
		} else {
			return fail(422, {
				error: "Update location failed!",
			});
		}
	},
} satisfies Actions;
