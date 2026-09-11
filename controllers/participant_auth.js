import Participant from "../models/participant_user.js";
import { hashPassword, comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const lifetime = "3600000";

export const registerParticipant = async (req, res) => {
  try {
    const { fullname, phoneNumber, email, password } = req.body;

    if (!fullname || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingParticipant = await Participant.findOne({ email });
    if (existingParticipant) {
      return res.status(400).json({ message: "A participant with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    await Participant.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Participant registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginParticipant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const participant = await Participant.findOne({ email });
    if (!participant) {
      return res.status(404).json({ message: "Participant account not found" });
    }

    const isMatch = await comparePassword(password, participant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    participant.password = undefined;
    participant.__v = undefined;

    const token = jwt.sign(
      { id: participant._id, role: "participant" },
      process.env.JWT_SECRET,
      { expiresIn: lifetime }
    );

    res.cookie("token", token, {
      maxAge: lifetime,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json(participant);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutParticipant = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return res.status(200).json({ message: "Logout successful" });
};

export const getParticipantProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "participant") {
      return res.status(401).json({ error: "Invalid token" });
    }
    const participant = await Participant.findById(decoded.id).select(["-password", "-__v"]);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    return res.status(200).json(participant);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};