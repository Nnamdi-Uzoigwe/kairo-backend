// src/utils/otp.js
const crypto = require('crypto');

// Generate a 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// In production, you'll use Nodemailer or Resend here
// For now, we'll just log the OTP (so we can test)
const sendOtpEmail = async (email, otp) => {
  console.log(`📧 OTP for ${email}: ${otp}`);
  // TODO: Integrate with Resend or Nodemailer
  return true;
};

module.exports = { generateOtp, sendOtpEmail };