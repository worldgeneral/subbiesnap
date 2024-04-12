import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import {
  addAccreditations,
  deleteAccreditation,
  deleteContractor,
  getAccreditation,
  getContractor,
  getContractors,
  registerContractor,
  updateAccreditation,
  updateContractor,
} from "../services/contractor.service";
import {
  ContractorsAccreditationsSchema,
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

contractorsRoutes.patch(
  "/contractors/:contractorId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = contractorSchema.parse(req.body);
    const contractorId = Number(req.params.contractorId);
    const updatedContractor = await updateContractor(
      contractorData,
      contractorId
    );
    res.json(updatedContractor);
  })
);

contractorsRoutes.delete(
  "/contractors/:contractorId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorId = Number(req.params.contractorId);
    const deletedContractor = await deleteContractor(contractorId);
    res.json(deletedContractor);
  })
);

contractorsRoutes.get(
  "/contractors/:contractorId/accreditations",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const newContractor = await getAccreditation(contractorData);
    res.json(newContractor);
  })
);

contractorsRoutes.post(
  "/contractors/:contractorId/accreditations",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = ContractorsAccreditationsSchema.parse(req.body);
    const newContractor = await addAccreditations(contractorData);
    res.json(newContractor).status(201);
  })
);

contractorsRoutes.patch(
  "/contractors/:contractorId/accreditations/:accreditationId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const accreditationData = ContractorsAccreditationsSchema.parse(req.body);
    const contractorId = Number(req.params.contractorId);
    const accreditationId = Number(req.params.accreditationId);
    const updatedContractor = await updateAccreditation(
      accreditationData,
      contractorId,
      accreditationId
    );
    res.json(updatedContractor);
  })
);

contractorsRoutes.delete(
  "/contractors/:contractorId/accreditations/:accreditationId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorId = Number(req.params.contractorId);
    const accreditationId = Number(req.params.accreditationId);
    const deletedContractor = await deleteAccreditation(accreditationId);
    res.json(deletedContractor);
  })
);

export { contractorsRoutes };
