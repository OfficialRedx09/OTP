const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');  // Import CORS package
const app = express();

// Use CORS middleware to allow requests from any origin
app.use(cors());  // This will allow all origins. You can customize it for security if needed.
app.use(express.json());  // Middleware to parse JSON request bodies

async function sendOTPEmail(recipientEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'marketwave.service@gmail.com',  // Your Gmail address
      pass: 'liol fzfd gxfb cixf',  // Your Gmail app password
    },
  });

  // HTML Email Template with OTP dynamically inserted
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Marketwave OTP</title>
  </head>
  <body style="background-color: #ffffff; font-family: 'Arial', sans-serif; padding: 20px; margin: 0;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border: 1px solid #ddd;">
          <tr>
              <td align="center">
                  <h2 style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 10px;">Marketwave</h2>
              </td>
          </tr>
          <tr>
              <td style="padding: 10px 20px; text-align: left; font-size: 16px; color: #444;">
                  <p>Hello!</p>
                  <p>Your authentication PIN-code:</p>
                  <h1 style="margin: 10px 0; color: gray; font-size: 28px; text-align: center;">${otp}</h1>
                  <p style="font-size: 12px; color: #666;">
                      You received this email because your email address was used to sign up on the Marketwave website.
                      If you did not sign up, please ignore this email.
                  </p>
                  <p style="font-size: 14px; color: #666;">
                      If you have any issues, feel free to contact us at
                      <strong>marketwave.service@gmail.com</strong>
                  </p>
                  <p style="font-size: 14px; margin-top: 20px; text-align: center; font-weight: bold;">All the best!</p>
                  <p style="text-align: center; font-size: 14px; font-weight: bold; color: #000;">Marketwave</p>
              </td>
          </tr>
      </table>

  </body>
  </html>
  `;

  // Email options
  const mailOptions = {
    from: '"Marketwave Service" <marketwave.service@gmail.com>',  
    to: recipientEmail,  
    subject: 'Your Marketwave OTP Code',  
    html: emailHtml,  
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP');
  }
}

// POST route to handle sending OTP
app.post('/send-otp', async (req, res) => {
  const { recipientEmail, otp } = req.body;

  if (!recipientEmail || !otp) {
    return res.status(400).json({ error: 'Missing recipient email or OTP' });
  }

  try {
    const info = await sendOTPEmail(recipientEmail, otp);
    res.json({
      message: 'OTP sent successfully!',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info), // Optional, useful for testing
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});