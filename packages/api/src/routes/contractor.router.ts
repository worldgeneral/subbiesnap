import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { getContractor, getContractors } from "../services/contractor.service";
import { getContractorSchema } from "../zodSchema/contractorSchema";

const subbiesRoutes = Router();

subbiesRoutes.get(
  "/contractors/:contractorId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorId = Number(req.params.contractorId);
    const contractor = await getContractor(contractorId);
    res.json(contractor);
  })
);

subbiesRoutes.get(
  "/contractors",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = getContractorSchema.parse(req.body);
    const contractors = await getContractors(data.limit, data.offset);
    res.json(contractors);
  })
);
