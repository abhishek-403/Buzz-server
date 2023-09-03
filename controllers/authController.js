const { error, success } = require("../utils/responseWrapper");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function mailer(receiverEmail, veriCode) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "Buzz",
      to: receiverEmail,
      subject: "Email Verification✉️",
      text: `Your email verification code is ${veriCode} `,
      html: `<b>Your email verification code is ${veriCode}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message url: %s", nodemailer.getTestMessageUrl(info));

    return "success";
  } catch (error) {
    console.log(error);
    return "error";
  }
}

const verifyEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) {
      return res.send(error(400, "Valid email required"));
    }

    const curUser = await User.findOne({ email });
    if (curUser) {
      return res.send(error(403, "User already exists."));
    }

    let veriCode = Math.floor(100000 + Math.random() * 900000);

    const mailerRes = await mailer(email, veriCode);
    if (mailerRes === "error") {
      return res.send(error(500, "Couldn't send code right now."));
    }

    return res.send(success(200, { veriCode, email }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const changeUserNameController = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.send(error(409, "All fields required"));
    }

    const curUserName = await User.findOne({ username });
    if (curUserName) {
      return res.send(error(409, "username exists"));
    }

    return res.send(success(200, "ok"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const signUpController = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!username || !email || !name || !password) {
      return res.send(error(409, "All fields required"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { _id: newUser._id },
      process.env.ACCESS_TOKEN_KEY
    );

    return res.send(success(201, { newUser, accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  signUpController,
  verifyEmailController,
  changeUserNameController,
};
