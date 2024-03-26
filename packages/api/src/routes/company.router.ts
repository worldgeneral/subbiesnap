import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { companySchema } from "../zodSchema/companySchema";
import { registerCompany, setCompanyOwner } from "../services/company.service";

const companyRoutes = Router();

companyRoutes.post(
  "/companies",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = companySchema.parse(req.body);
    const company = await registerCompany(data.name, data.logo, data.blurb);
    const companyOwner = await setCompanyOwner(req.user.id, company.id);
    res.json(company);
  })
);
