import {
	S3Client,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import { SCW_BUCKET_NAME as LOCAL_BUCKET_NAME,SCW_ACCESS_KEY as LOCAL_ACCESS_KEY,SCW_SECRET_KEY as LOCAL_SECRET_KEY } from '$env/static/private';

const BUCKET_NAME=process.env.SCW_BUCKET_NAME ?? LOCAL_BUCKET_NAME
const ACCESS_KEY = process.env.SCW_ACCESS_KEY ?? LOCAL_ACCESS_KEY
const SECRET_KEY = process.env.SCW_SECRET_KEY??LOCAL_SECRET_KEY

const s3 = new S3Client({
	region: "fr-par", // e.g., "fr-par"
	endpoint: "https://s3.fr-par.scw.cloud", // For Scaleway; use AWS endpoint for AWS
	credentials: {
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET_KEY,
	},
});

export async function uploadImageToS3(image:Buffer, key: string) {
	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: BUCKET_NAME,
				Key: key,
				Body: image,
				ContentType: "image/webp",
				ACL: "public-read",
			})
		);
		console.log(`  ✅ Uploaded ${key}`);
        return true
	} catch (error) {
		console.log(` 	❌  Error uploading image ${key}`);
		console.log(error);
        return false
	}
}
