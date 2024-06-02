import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./client";

export async function uploadFile(
  fileBuffer: Buffer,
  mimetype: string,
  fileName: string
) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME_UPLOADS,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
}
