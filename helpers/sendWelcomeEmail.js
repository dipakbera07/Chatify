import { Resend } from 'resend';
import { welcomeEmailTemplate } from '../email/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name,email) {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Chatify',
      react: welcomeEmailTemplate(name),
    });

    return {success:true, message:"Welcome email sent successfully"}
  } catch (error) {
    return {success:false, message:"Failed to send Welcome email"}
  }
}