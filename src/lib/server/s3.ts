import {
	S3Client,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import "dotenv/config";

const s3 = new S3Client({
	region: "fr-par", // e.g., "fr-par"
	endpoint: "https://s3.fr-par.scw.cloud", // For Scaleway; use AWS endpoint for AWS
	credentials: {
		accessKeyId: process.env.SCW_ACCESS_KEY || "",
		secretAccessKey: process.env.SCW_SECRET_KEY || "",
	},
});

export async function uploadImageToS3(image:Buffer, key: string) {
	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: process.env.SCW_BUCKET_NAME,
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
