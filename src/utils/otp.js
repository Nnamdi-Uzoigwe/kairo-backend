// src/utils/otp.js
const { Resend } = require("resend");
const crypto = require("crypto");

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a 6-digit OTP
export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via Resend
export const sendOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kairo <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your Kairo password',
      text: `Your OTP code is: ${otp}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('✅ OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};