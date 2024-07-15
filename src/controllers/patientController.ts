import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const patientCreateConfig = ({ token }) => ({
  headers: {
    accept: "application/fhir+json, */*; q=0.1",
    "Content-Type": "application/fhir+json",
    Authorization: `Bearer ${token}`,
    "X-Medplum": "extended",
  },
});

export const handleCreatePatient = async (req, res) => {
  const token = req?.header("Authorization")?.split(" ")[1];

  console.log("token", token);

  try {
    // const {
    //   resourceType,
    //   name,
    //   gender,
    //   birthDate,
    //   deceasedBoolean,
    //   maritalStatus,
    // } = req.body;

    const createData = req.body;

    console.log("create Data rb", req?.body);

    console.log("create Data", createData);

    const createResponse = await axios.post(
      `${process.env.HC_BASE_URL}fhir/R4/Patient`,
      createData,
      patientCreateConfig({ token })
    );

    console.log("createResponse", createResponse);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};
