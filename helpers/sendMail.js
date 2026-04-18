import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // Correo desde .env
      pass: process.env.MAIL_PASS  // Contraseña de aplicación desde .env
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `AuthDotnet App <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', to);
  } catch (err) {
    console.error('Error enviando correo:', err);
    throw err;
  }
};
