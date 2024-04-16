import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { sessionAuth } from "../middleware/session.auth";
import {
  companySchema,
  createCompanySchema,
  createCompanyUserSchema,
  updateCompanyUserSchema,
} from "../rules/company.rule";
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
} from "../services/company.service";
import { companyAuth } from "../middleware/company.auth";
import { UserCompanyRole } from "../utils/magic.numbers";
import { paginationSchema } from "../rules/pagination.rule";

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
  tryCatch(async (req: Request, res) => {
    const data = createCompanySchema.parse(req.body);
    const company = await registerCompany(data, req.user!.id);
    res.json(company).status(201);
  })
);

companiesRoutes.patch(
  "/companies/:companyId",
  sessionAuth,
  companyAuth(UserCompanyRole.Admin),
  tryCatch(async (req: Request, res) => {
    const data = companySchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const company = await updateCompanyData(data, companyId);
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
    res.json([updatedCompanyUser[0], updatedCompanyUser[1].role]);
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
