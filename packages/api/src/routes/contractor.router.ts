import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { sessionAuth } from "../middleware/session-auth.middleware";
import {
  addAccreditations,
  deleteAccreditation,
  deleteContractor,
  getAccreditation,
  getAccreditations,
  getContractor,
  getContractors,
  registerContractor,
  updateAccreditation,
  updateContractor,
} from "../services/contractor.service";
import {
  ContractorsAccreditationsSchema,
  CreateContractorSchema,
  UpdateContractorSchema,
  UpdateContractorsAccreditationSchema,
} from "../rules/contractor.rule";
import { paginationSchema } from "../rules/pagination.rule";
import { number } from "zod";

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
    const pagination = paginationSchema.parse(req.query);
    const contractors = await getContractors(
      pagination.limit,
      pagination.offset
    );
    res.json(contractors);
  })
);

contractorsRoutes.post(
  "/contractors",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = CreateContractorSchema.parse(req.body);
    const newContractor = await registerContractor(
      contractorData,
      req.user!.id
    );
    res.json(newContractor).status(201);
  })
);

contractorsRoutes.patch(
  "/contractors/:contractorId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = UpdateContractorSchema.parse(req.body);
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
    const pagination = paginationSchema.parse(req.query);
    const contractorId = Number(req.params.contractorId);
    const accreditations = await getAccreditations(
      contractorId,
      pagination.limit,
      pagination.offset
    );
    res.json(accreditations);
  })
);

contractorsRoutes.get(
  "/contractors/:contractorId/accreditations/:accreditationId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const accreditationId = Number(req.params.accreditationId);
    const accreditation = await getAccreditation(accreditationId);
    res.json(accreditation);
  })
);

contractorsRoutes.post(
  "/contractors/:contractorId/accreditations",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const contractorData = ContractorsAccreditationsSchema.parse(req.body);
    const contractorId = Number(req.params.contractorId);
    const accreditations = await addAccreditations(
      contractorData,
      contractorId,
      req.user!.id
    );
    res.json(accreditations).status(201);
  })
);

contractorsRoutes.patch(
  "/contractors/:contractorId/accreditations/:accreditationId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const accreditationData = UpdateContractorsAccreditationSchema.parse(
      req.body
    );
    const accreditationId = Number(req.params.accreditationId);
    const contractorId = Number(req.params.contractorId);
    const updatedContractor = await updateAccreditation(
      accreditationData,
      accreditationId,
      contractorId,
      req.user!.id
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
    const deletedContractor = await deleteAccreditation(
      accreditationId,
      contractorId,
      req.user!.id
    );
    res.json(deletedContractor);
  })
);

export { contractorsRoutes };
