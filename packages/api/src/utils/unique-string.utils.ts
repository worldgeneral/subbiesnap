import crypto from "crypto";

/** Sync */
export async function randomStringAsBase64Url(size: number) {
  return crypto.randomBytes(size).toString("base64url");
}
