import { Request, Router } from "express";
import { UserCompanyRole } from "../../../../constants/company-emuns";
import { HttpStatus } from "../../../../constants/https";
import { tryCatch } from "../../errors/try-catch";
import { upload } from "../../media-store/middleware";
import { paginationSchema } from "@subbiesnap/types/pagination";
import { sessionAuth } from "../auth-module/session-auth.middleware";
import { companyAuth } from "./company-auth.middleware";
import {
  createCompanySchema,
  createCompanyUserSchema,
  updateCompanySchema,
  updateCompanyUserSchema,
} from "@subbiesnap/types/company";
import {
  addCompanyUser,
  deleteCompanyData,
  deleteCompanyUser,
  getCompanies,
  getCompany,
  getCompanyUser,
  registerCompany,
  updateCompanyData,
  updateCompanyUser,
} from "./company.service";

const companiesRoutes = Router();

companiesRoutes.get(
  "/companies/:companyId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const company = await getCompany(companyId);
    res.json(company);
  })
);

companiesRoutes.get(
  "/companies",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const pagination = paginationSchema.parse(req.query);
    const company = await getCompanies(pagination.limit, pagination.offset);
    res.json(company);
  })
);

companiesRoutes.post(
  "/companies",
  sessionAuth,
  upload.single("company-logo"),
  tryCatch(async (req: Request, res) => {
    const file = req.file;
    const data = createCompanySchema.parse(req.body);
    const company = await registerCompany(data, req.user!.id, file);
    res.json(company).status(HttpStatus.Created);
  })
);

companiesRoutes.patch(
  "/companies/:companyId",
  sessionAuth,
  companyAuth(UserCompanyRole.Admin),
  upload.single("company-logo"),
  tryCatch(async (req: Request, res) => {
    const file = req.file;
    const data = updateCompanySchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const company = await updateCompanyData(data, companyId, file);
    res.json(company);
  })
);

companiesRoutes.delete(
  "/companies/:companyId",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const company = await deleteCompanyData(companyId);
    res.json(company);
  })
);

companiesRoutes.get(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const pagination = paginationSchema.parse(req.query);
    const companyId = Number(req.params.companyId);
    const users = await getCompanyUser(
      pagination.limit,
      pagination.offset,
      companyId
    );
    res.json(users);
  })
);

companiesRoutes.post(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = createCompanyUserSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const newCompanyUser = await addCompanyUser(
      data.email,
      data.role,
      companyId
    );

    res.json(newCompanyUser);
  })
);

companiesRoutes.patch(
  "/companies/:companyId/users/:userId",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = updateCompanyUserSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const userId = Number(req.params.userId);
    const updatedCompanyUser = await updateCompanyUser(
      userId,
      data.role,
      companyId
    );
    res.json({ ...updatedCompanyUser[0], role: updatedCompanyUser[1].role });
  })
);

companiesRoutes.delete(
  "/companies/:companyId/users/:userId",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const userId = Number(req.params.userId);
    const deletedCompanyUser = await deleteCompanyUser(userId, companyId);
    res.json(deletedCompanyUser);
  })
);

export { companiesRoutes };
