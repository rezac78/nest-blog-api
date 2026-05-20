import * as bcrypt from "bcrypt";

export async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const codeHash = await bcrypt.hash(otp, 10);

  return {
    otp,
    codeHash,
  };
}
