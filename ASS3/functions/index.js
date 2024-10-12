const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const functions = require("firebase-functions");

const nodemailer = require("nodemailer");

admin.initializeApp();

exports.sendVerificationCode = onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "OPTIONS") {
      // 对于预检请求，返回状态码 204
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    // 处理 POST 请求
    const email = req.body.email;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 存储验证码到 Firestore
    const db = admin.firestore();
    db.collection("verificationCodes").doc(email).set({code})
        .then(() => {
          const mailOptions = {
            from: "Dusk <254539056@qq.com>",
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is ${code}`,
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

exports.listAllUsers = functions.https.onRequest(async (req, res) => {
  try {
    const users = [];
    const listUsersResult = await admin.auth().listUsers(1000);
    listUsersResult.users.forEach((userRecord) => {
      users.push({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      });
    });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).send("Error listing users");
  }
});
