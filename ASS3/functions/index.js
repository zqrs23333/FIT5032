const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const functions = require("firebase-functions");
const express = require("express");

const nodemailer = require("nodemailer");

const app = express();
app.use(express.urlencoded({extended: true}));

admin.initializeApp();

exports.sendVerificationCode = onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    // 处理 POST 请求
    const email = req.body.email;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const subject = req.body.subject || "Your Verification Code: ${code}";
    const text = req.body.text || "Your default message text";


    const db = admin.firestore();
    db.collection("verificationCodes").doc(email).set({code})
        .then(() => {
          const mailOptions = {
            from: "Dusk <254539056@qq.com>",
            to: email,
            subject,
            text,
          };

          // 使用 nodemailer 发送邮件
          const transporter = nodemailer.createTransport({
            host: "smtp.qq.com",
            port: 465,
            secure: true,
            auth: {
              user: "254539056@qq.com",
              pass: "ptmhiqjqmrktbgei",
            },
          });

          return transporter.sendMail(mailOptions);
        })
        .then(() => {
          res.set("Access-Control-Allow-Origin", "*"); // 允许前端请求
          res.status(200).send({success: true});
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.set("Access-Control-Allow-Origin", "*"); // 允许前端请求
          res.status(500).send("Failed to send verification email");
        });
  });
});

exports.sendCustomEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "OPTIONS") {
      // 对于预检请求，返回状态码 204
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    if (!subject.trim()) {
      console.error("Error: subject is required and cannot be empty.");
      res.status(400).send("Subject is required.");
      return;
    } else {
      console.log("subject ok");
    }

    if (!text.trim()) {
      console.error("Error: text is required and cannot be empty.");
      res.status(400).send("Text is required.");
      return;
    } else {
      console.log("text ok");
    }
    const email = req.body.email;
    if (!email) {
      console.error("Error: email is required and cannot be empty.");
      res.status(400).send("Email is required.");
      return;
    } else {
      console.log("Email ok");
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const subject = req.body.subject || "Your Verification Code";
    const text = req.body.text || "Your default message text";
    // const attachmentPath = req.body.attachmentPath || null;

    // 存储验证码到 Firestore
    const db = admin.firestore();
    db.collection("verificationCodes").doc(email).set({code})
        .then(() => {
          const mailOptions = {
            from: "Dusk <254539056@qq.com>",
            to: email,
            subject,
            text,
            // attachments: attachmentPath?
            //   [{filename: attachmentPath.split("/").pop(),
            //     path: attachmentPath}]:
            //   [],
          };

          // 使用 nodemailer 发送邮件
          const transporter = nodemailer.createTransport({
            host: "smtp.qq.com",
            port: 465,
            secure: true,
            auth: {
              user: "254539056@qq.com",
              pass: "ptmhiqjqmrktbgei",
            },
          });

          return transporter.sendMail(mailOptions);
        })
        .then(() => {
          res.set("Access-Control-Allow-Origin", "*"); // 允许前端请求
          res.status(200).send({success: true});
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.set("Access-Control-Allow-Origin", "*"); // 允许前端请求
          res.status(500).send("Failed to send verification email");
        });
  });
});
