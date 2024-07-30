import { Request, Router } from "express";
import { HttpStatus } from "@subbiesnap/constants/https";
import { tryCatch } from "../../errors/try-catch";
import { upload } from "../../media-store/middleware";
import { paginationSchema } from "@subbiesnap/types/pagination";
import { sessionAuth } from "../auth-module/session-auth.middleware";
import { contractorAuth } from "./contractor-auth.middleware";
import {
  ContractorsAccreditationsSchema,
  CreateContractorSchema,
  UpdateContractorSchema,
  UpdateContractorsAccreditationSchema,
} from "@subbiesnap/types/contractor";
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
} from "./contractor.service";

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
  upload.single("contractor-logo"),
  tryCatch(async (req: Request, res) => {
    const file = req.file;
    const contractorData = CreateContractorSchema.parse(req.body);
    const newContractor = await registerContractor(
      contractorData,
      req.user!.id,
      file
    );
    res.json(newContractor).status(HttpStatus.Created);
  })
);

contractorsRoutes.patch(
  "/contractors/:contractorId",
  sessionAuth,
  contractorAuth,
  upload.single("contractor-logo"),
  tryCatch(async (req: Request, res) => {
    const file = req.file;
    const contractorData = UpdateContractorSchema.parse(req.body);
    const contractorId = Number(req.params.contractorId);
    const updatedContractor = await updateContractor(
      contractorData,
      contractorId,
      req.user!.id,
      file
    );
    res.json(updatedContractor);
  })
);

contractorsRoutes.delete(
  "/contractors/:contractorId",
  sessionAuth,
  contractorAuth,
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
  contractorAuth,
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
  contractorAuth,
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
  contractorAuth,
  tryCatch(async (req: Request, res) => {
    const contractorId = Number(req.params.contractorId);
    const accreditationId = Number(req.params.accreditationId);
    const deletedContractor = await deleteAccreditation(accreditationId);
    res.json(deletedContractor);
  })
);

export { contractorsRoutes };
