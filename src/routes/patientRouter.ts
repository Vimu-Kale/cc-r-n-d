import express from "express";
import { handleCreatePatient } from "../controllers/patientController";
const router = express.Router();

router.post("/create-patient", handleCreatePatient);

export default router;
