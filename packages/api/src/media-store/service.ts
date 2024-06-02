import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./client";

export async function uploadFile(
  fileBuffer: Buffer,
  mimetype: string,
  filePath: string
) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME_UPLOADS,
    Body: fileBuffer,
    Key: filePath,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
}
