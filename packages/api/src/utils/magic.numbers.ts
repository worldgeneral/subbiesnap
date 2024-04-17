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

export const sessionTokenExpireDays = 7;
export const sessionTokenStringLength = 128;
