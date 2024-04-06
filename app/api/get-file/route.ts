import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type FileItem = {
  fileKey: string;
  url: string;
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("fileKey");
  if (!fileKey) {
    return Response.json({ error: "File key is required" }, { status: 400 });
  }

  try {
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };
    const getObjectCommand = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    const fileDetails: FileItem = {
      fileKey: fileKey,
      url: signedUrl,
    };

    return Response.json(fileDetails, { status: 200 });
  } catch (error) {
    console.error("Error getting file details:", error);
    return Response.json(
      { error: "Error getting file details" },
      { status: 500 }
    );
  }
}
