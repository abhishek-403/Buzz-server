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

    return "success";
  } catch (error) {
    console.log(error);
    return "error";
  }
}

const verifyEmailController = async (req, res) => {
  try {
    const { email } = req.body;
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
      return res.send(error(500, "Couldn't send code to this email."));
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

const forgetPassController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send(error(400, "Valid email required"));
    }

    const curUser = await User.findOne({ email });
    if (!curUser) {
      return res.send(error(403, "Email is not registered."));
    }

    let veriCode = Math.floor(100000 + Math.random() * 900000);

    const mailerRes = await mailer(email, veriCode);
    if (mailerRes === "error") {
      return res.send(error(500, "Couldn't send code to this email."));
    }

    return res.send(success(200, { veriCode, email }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(409, "All fields required"));
    }

    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    return res.send(success(200, "Passord changed successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginContoller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(409, "All fields required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send(error(404, "Email not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.send(error(403, "Incorrect password"));
    }

    await user.save();

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_KEY
    );

    return res.send(success(201, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  signUpController,

  verifyEmailController,
  changeUserNameController,
  forgetPassController,
  resetPasswordController,
  loginContoller,
};
