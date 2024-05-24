import { COMPANY_NAME } from "./branding";

export const NO_REPLY_EMAIL = "no-reply@subbiesnap.com";

export const CONFIRM_EMAIL_ID_LENGTH = 30;

export const CONFIRM_EMAIL_HTTP_ADDRESS =
  process.env.NODE_ENV === "production"
    ? `www.${COMPANY_NAME}.com/email-auth`
    : "http://localhost:3001/email-auth";
