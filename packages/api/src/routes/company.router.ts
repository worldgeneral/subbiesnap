import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import {
  addCompanyUserRoleSchema,
  companySchema,
  updateCompanyUserRoleSchema,
} from "../zodSchema/companySchema";
import {
  UserCompanyRole,
  addCompanyUser,
  deleteCompanyData,
  deleteCompanyUser,
  registerCompany,
  updateCompanyData,
  updateCompanyUser,
} from "../services/company.service";
import { companyAuth } from "../middleware/companyAuth";
import { userSchema } from "../zodSchema/userSchema";

const companyRoutes = Router();

companyRoutes.post(
  "/companies",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = companySchema.parse(req.body);
    const company = await registerCompany(
      data.name,
      data.logo,
      data.blurb,
      req.user!.id
    );
    res.json(company).status(201);
  })
);

companyRoutes.patch(
  "/companies/:companyId",
  sessionAuth,
  companyAuth(UserCompanyRole.Admin),
  tryCatch(async (req: Request, res) => {
    const data = companySchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const company = await updateCompanyData(
      data.name,
      data.logo,
      data.blurb,
      companyId
    );
    res.json(company);
  })
);

companyRoutes.delete(
  "/companies/:companyId",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const company = await deleteCompanyData(companyId);
    res.json(company);
  })
);

companyRoutes.post(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = addCompanyUserRoleSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const newCompanyUser = await addCompanyUser(
      data.email,
      data.role,
      companyId
    );

    res.json(newCompanyUser);
  })
);

companyRoutes.patch(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = updateCompanyUserRoleSchema.parse(req.body, req.body.user);
    const user = userSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const updatedCompanyUser = await updateCompanyUser(
      data.userId,
      data.role,
      companyId
    );
    res.json({ user, updatedCompanyUser });
  })
);

companyRoutes.delete(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = updateCompanyUserRoleSchema.parse(req.body, req.body.user);
    const user = userSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const deletedCompanyUser = await deleteCompanyUser(
      data.userId,
      data.role,
      companyId
    );
    res.json({ user, deletedCompanyUser });
  })
);

export { companyRoutes };
