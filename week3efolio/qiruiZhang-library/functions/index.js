// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const app = express();
const upload = multer();

app.post('/send-email', upload.single('attachment'), (req, res) => {
  const { recipient, subject, body } = req.body;
  const attachment = req.file;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipient,
    subject: subject,
    text: body,
    attachments: attachment ? [{ filename: attachment.originalname, content: attachment.buffer }] : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    res.json({ message: 'Email sent successfully!' });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
