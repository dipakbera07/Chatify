import { EmailTemplate } from '../email/VerificationEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("Sending email...");
export async function sendVerificationEmail(email,name,verifyCode) {
  try {
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification code',
      react: EmailTemplate({ name, verifyCode }),
    });

    console.log("Resend response:", response);

    return {success:true, message:"Verification email sent successfully"}
  } catch (error) {
    return {success:false, message:"Failed to send verification email"}
  }
}