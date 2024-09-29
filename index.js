import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors("*"));

app.use(express.json());

app.post("/api/send", async (req, res) => {
  try {
    const { subject, email, message } = req.body;

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    const MAIL = process.env.MAIL;

    if (!gmailUser || !MAIL) {
      throw new Error("Gmail credentials are missing in environment variables");
    }

    // Nodemailer configuration
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: gmailUser, // Gmail address
        pass: gmailPass, // App password
      },
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${email},</p>
    <p>I hope this message finds you well. I wanted to take a moment to let you know that I am available should you need any assistance or have any questions regarding your inquiry.</p>
    <p>Whether you would like to discuss further, need clarification, or explore new opportunities, please don’t hesitate to reach out. I am happy to arrange a meeting or respond to your queries via email or phone at your convenience.</p>
    <p>You can contact me directly at <strong>Perumalkce2022@gmail.com</strong> or <strong>9344003498</strong>.</p>
    <p>Thank you for your time, and I look forward to connecting with you soon.</p>
    <p>Best regards,<br>
    Perumal<br>
    Full Stack Developer<br>
    9344003498</p>
</body>
</html>
`;

    let mailOptions = {
      from: gmailUser, // Gmail email, as Gmail requires the "from" to be the authenticated user
      to: MAIL, // Sending email to yourself
      subject: subject,
      text: message,
      replyTo: email,
    };

    let replymailOptions = {
      from: gmailUser, // Gmail email, as Gmail requires the "from" to be the authenticated user
      to: email, // Sending email to yourself
      subject: `RE: ${subject}`,
      html: htmlContent,
      text: message,
      replyTo: MAIL, // Sending email to yourself
    };

    const info = await transporter.sendMail(mailOptions);
    const replymail = await transporter.sendMail(replymailOptions);

    console.log("Email sent: " + info.response);
    console.log("Reply Email sent: " + replymail.response);
    return res.status(200).json({ msg: "Email sent: " + info.response });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

app.listen(3000, () => {
  console.log("server working");
});
