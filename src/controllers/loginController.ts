import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import getCodeVerifierAndChallenge from "../utils/pkceChallenge";
dotenv.config();

const loginReqConfig: AxiosRequestConfig = {
  headers: {
    accept: "application/fhir+json, */*; q=0.1",
    "X-Medplum": "extended",
  },
};

const tokenReqConfig: AxiosRequestConfig = {
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-Medplum": "extended",
  },
};

const meReqConfig = ({ authorization }) => ({
  headers: {
    Authorization: `Bearer ${authorization}`,
    Accept: "application/fhir+json, */*; q=0.1",
    "X-Medplum": "extended",
  },
});

const loginReqData = ({ email, password, codeChallenge }) => ({
  email: email,
  password: password,
  remember: false,
  scope: "offline",
  codeChallengeMethod: "S256",
  codeChallenge: codeChallenge,
  clientId: "",
});

const tokenReqData = ({ codeVerifier, code }) =>
  new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    client_id: "",
    redirect_uri: "http://localhost:3000/",
    code_verifier: codeVerifier,
  });

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // let loginResponse: any;
    // let tokenResponse: any;
    // let meResponse: any;
    const { codeVerifier, codeChallenge } = await getCodeVerifierAndChallenge();
    const loginResponse = await axios.post(
      `${process.env.HC_BASE_URL}auth/login`,
      loginReqData({
        email,
        password,
        codeChallenge,
      }),
      loginReqConfig
    );

    // const { data: loginResData, status: loginResStatus } = loginResponse;

    if (loginResponse.data?.code) {
      const tokenResponse = await axios.post(
        `${process.env.HC_BASE_URL}oauth2/token`,
        tokenReqData({ codeVerifier, code: loginResponse?.data?.code }),
        tokenReqConfig
      );

      // const { data: tokenResData, status: tokenResStatus } = tokenResponse;
      console.log("tokenResponse", tokenResponse);

      if (tokenResponse.data?.access_token) {
        const meResponse = await axios.get(
          `${process.env.HC_BASE_URL}auth/me`,
          meReqConfig({ authorization: tokenResponse?.data?.access_token })
        );

        // const { data: meResData, status: meResStatus } = meResponse;
        console.log("meResponse", meResponse);
        return res.status(200).json({
          success: true,
          tokenData: tokenResponse?.data,
          meData: meResponse?.data,
        });
      }
    }
    return res.status(400).json({
      error: "Login Failed.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};
