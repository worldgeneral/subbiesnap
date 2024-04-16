import crypto from "crypto";

/** Sync */
async function randomStringAsBase64Url(size: number) {
  return crypto.randomBytes(size).toString("base64url");
}
export { randomStringAsBase64Url };
