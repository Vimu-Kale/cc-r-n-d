import * as crypto from "crypto";

const base64url = (buffer: Buffer): string => {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const generateCodeVerifierAndChallenge = async (): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> => {
  try {
    // Generate code_verifier
    const codeVerifier = base64url(crypto.randomBytes(32));

    // Generate code_challenge
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    const codeChallenge = base64url(hash);

    return { codeVerifier, codeChallenge };
  } catch (error) {
    throw new Error("Failed to generate code verifier and challenge");
  }
};

const getCodeVerifierAndChallenge = async (): Promise<{
  codeVerifier: string;
  codeChallenge: string;
} | null> => {
  try {
    const { codeVerifier, codeChallenge } =
      await generateCodeVerifierAndChallenge();
    return { codeVerifier, codeChallenge };
  } catch (error) {
    console.error("Error:", error);
    // Handle error appropriately
    return null;
  }
};

export default getCodeVerifierAndChallenge;
