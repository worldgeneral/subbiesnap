import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import {
  getContractor,
  getContractors,
  registerContractor,
} from "../services/contractor.service";
import {
  contractorSchema,
  getContractorSchema,
} from "../zodSchema/contractorSchema";

const contractorsRoutes = Router();

contractorsRoutes.get(
  "/contractors/:contractorId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorId = Number(req.params.contractorId);
    const contractor = await getContractor(contractorId);
    res.json(contractor);
  })
);

contractorsRoutes.get(
  "/contractors",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = getContractorSchema.parse(req.body);
    const contractors = await getContractors(data.limit, data.offset);
    res.json(contractors);
  })
);

contractorsRoutes.post(
  "/contractors",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = contractorSchema.parse(req.body);
    const newContractor = await registerContractor(contractorData);
    res.json(newContractor).status(201);
  })
);

export { contractorsRoutes };
