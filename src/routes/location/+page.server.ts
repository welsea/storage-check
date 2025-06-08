import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import sharp from "sharp";
import { uploadImageToS3 } from "$lib/server/s3.js";

async function handleImage(image: File, name: string) {
	const arrayBuffer = await image.arrayBuffer();
	const nodeBuffer = Buffer.from(arrayBuffer);
	const processedImageBuffer = await sharp(nodeBuffer)
		.resize(500)
		.webp({ quality: 80 })
		.toBuffer();
	const result = await uploadImageToS3(processedImageBuffer, name);
	return result;
}

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		try {
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
			} else {
				return fail(422, {
					error: "upload failed",
				});
			}
		} catch (error: any) {
			return fail(422, {
				error: error.message,
			});
		}
	},
	edit: async ({ request, locals }) => {
		const data = await request.formData();
		try {
			const image = data.get("image") as File | null;
			const name = data.get("name") as string;
			const id = data.get("id") as string;
			const userid = locals.user!.id;

			if (!image || !image.type.startsWith("image/")) {
				return fail(400, { error: "Please upload a valid image" });
			}
			const filename = `${name}_cover.webp`;
			const result = await handleImage(image, filename);
			if (result)
				await db.updateLocationCover(id, name, filename, userid);
			else {
				return fail(422, {
					error: "upload failed",
				});
			}
		} catch (error: any) {
			return fail(422, {
				error: error.message,
			});
		}
	},
};
