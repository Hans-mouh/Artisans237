// mailer.js — Artisans237
// Sends verification emails via Gmail SMTP using an App Password (not your
// normal Gmail password). To set this up:
//   1. Turn on 2-Step Verification on the Gmail account you'll send from.
//   2. Go to myaccount.google.com/apppasswords and create an app password.
//   3. Put that 16-character password in GMAIL_APP_PASSWORD below (.env file).
// Gmail SMTP comfortably handles low volume (roughly up to ~500/day) — fine
// for an early-stage launch. If Artisans237 grows past that, switch to a
// transactional email service later; this file is the only place that changes.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const APP_NAME = 'Artisans237';
const APP_URL = process.env.APP_URL || 'http://localhost:8080';

async function sendVerificationEmail(toEmail, fullName, token) {
  const verifyLink = `${APP_URL}/verify-email.html?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#16171A;">Bienvenue sur ${APP_NAME} / Welcome to ${APP_NAME}</h2>
      <p>Bonjour ${fullName},</p>
      <p>Merci de vous être inscrit. Cliquez ci-dessous pour vérifier votre adresse email :</p>
      <p style="margin: 24px 0;">
        <a href="${verifyLink}" style="background:#2F6FED;color:#F2F4F8;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Vérifier mon email
        </a>
      </p>
      <p style="color:#666;font-size:13px;">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p>Hello ${fullName},</p>
      <p>Thanks for signing up. Click the button above (or this link) to verify your email: <br>${verifyLink}</p>
      <p style="color:#666;font-size:13px;">This link expires in 24 hours. If you didn't create this account, ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Vérifiez votre email / Verify your email — ${APP_NAME}`,
    html,
  });
}

module.exports = { sendVerificationEmail };
