export enum CompanyStatus {
  Active = "active",
  Deleted = "deleted",
}

export enum UserCompanyRole {
  Owner = 0,
  Admin = 10,
  Editor = 20,
  Contributor = 30,
}

export const SESSION_TOKEN_EXPIRE_DAYS = 7;
export const SESSION_TOKEN_STRING_LENGTH = 128;
