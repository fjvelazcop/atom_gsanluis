// ============================================
// Grupo San Luis - Contact Form API
// Vercel Serverless Function
// POST /api/contact
// ============================================

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const { name, email, phone, unidad, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo electrónico y mensaje son requeridos'
      });
    }

    // Email recipient from environment variable
    const contactEmail = process.env.CONTACT_EMAIL || 'desarrollo.corpoagro@gmail.com';

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Build email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Rubik', 'Segoe UI', sans-serif; background: #f4f7fa; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 2rem auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #003366, #004d99); padding: 2rem; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 1.5rem; font-weight: 700; }
          .header span { color: #95c800; }
          .body { padding: 2rem; }
          .field { margin-bottom: 1.25rem; }
          .field-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 0.25rem; }
          .field-value { font-size: 1rem; color: #1a1a2e; background: #f8f9fc; padding: 0.75rem 1rem; border-radius: 12px; border-left: 4px solid #95c800; }
          .field-value a { color: #003366; text-decoration: none; }
          .footer { background: #f0f4f8; padding: 1.5rem; text-align: center; font-size: 0.8rem; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Nuevo mensaje de contacto · <span>Grupo San Luis</span></h1>
          </div>
          <div class="body">
            <div class="field">
              <div class="field-label">Nombre completo</div>
              <div class="field-value">${escapeHTML(name)}</div>
            </div>
            <div class="field">
              <div class="field-label">Correo electrónico</div>
              <div class="field-value"><a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a></div>
            </div>
            <div class="field">
              <div class="field-label">Teléfono</div>
              <div class="field-value">${escapeHTML(phone || 'No especificado')}</div>
            </div>
            <div class="field">
              <div class="field-label">Unidad de Negocio de interés</div>
              <div class="field-value">${escapeHTML(unidad || 'No especificada')}</div>
            </div>
            <div class="field">
              <div class="field-label">Mensaje</div>
              <div class="field-value">${escapeHTML(message)}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de <strong>gruposanluis.com.ve</strong></p>
            <p>© ${new Date().getFullYear()} Grupo San Luis. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Formulario Web - Grupo San Luis" <${process.env.SMTP_USER || email}>`,
      to: contactEmail,
      replyTo: email,
      subject: `[Grupo San Luis] Contacto de ${name}`,
      text: `
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'N/A'}
Unidad: ${unidad || 'N/A'}
Mensaje: ${message}
      `,
      html: emailHTML
    });

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });
  } catch (error) {
    console.error('Error sending email:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje. Por favor intente de nuevo más tarde.'
    });
  }
};

// Utility to escape HTML
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

