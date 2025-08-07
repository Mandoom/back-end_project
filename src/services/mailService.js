import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendRecoveryEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `Ecommerce App <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
