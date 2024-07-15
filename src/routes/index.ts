import express from "express";
import authRoutes from "./authRouter";
import patientRoutes from "./patientRouter";
const router = express.Router();

//ROOT ROUTE
router.get("/", (req, res) => {
  console.log("On To The Root Rout!");
  res.status(200).json({ message: "Success" });
});

router.use("/api/auth", authRoutes);

router.use("/api/patient", patientRoutes);

export default router;
