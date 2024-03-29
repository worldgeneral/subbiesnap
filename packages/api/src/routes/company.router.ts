import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { companyRoles, companySchema } from "../zodSchema/companySchema";
import {
  UserCompanyRole,
  addCompanyUser,
  registerCompany,
} from "../services/company.service";
import { companyAuth } from "../middleware/companyAuth";

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

companyRoutes.post(
  "/companies/:companyId/users",
  sessionAuth,
  companyAuth(UserCompanyRole.Owner),
  tryCatch(async (req: Request, res) => {
    const data = companyRoles.parse(req.body);

    const newCompanyUser = addCompanyUser(
      data.email,
      data.role,
      req.params.companyId
    );

    res.json(newCompanyUser);
  })
);

export { companyRoutes };
