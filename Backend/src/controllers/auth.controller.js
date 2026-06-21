import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/mail.service.js";
dotenv.config();


export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await userModel.create({
      username,
      email,
      password,
    });

    // Send welcome email with verification link
    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const backendUrl = `${req.protocol}://${req.get("host")}`;

    await sendEmail(
      user.email,
      "Welcome to Purplex",
      `<p>Hi ${user.username},</p>
    <p>Thank you for registering at <b>Purplex</b> <br/> We're excited to have you on board.</p>
    <p>Click the link below to verify your email:</p>
    <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
   <p>Best regards,<br>The Purplex Team</p>`,
      `Hi ${user.username}, Thank you for registering at Purplex! We're excited to have you on board.`
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      emailVerificationToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

export const verifyEmail = async (req, res) => {
    try{
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }
        user.verified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to verify email"
        });
    }
}

export const login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      ...(isProduction ? {} : { domain: "localhost" }),
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",  
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to login",
    });

  }

};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });} catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user data",
    });
  }
}; 