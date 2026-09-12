import Organizer from "../models/organizer_user.js";
import { hashPassword, comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const lifetime = "3600000";

const cookieOptions = {
  maxAge: Number(lifetime),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const registerOrganizer = async (req, res) => {
  try {
    const { organizationName, organizationType, contactPerson, email, password } = req.body;

    if (!organizationName || !organizationType || !contactPerson || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({ message: "An organizer with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    await Organizer.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Organizer registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer account not found" });
    }

    const isMatch = await comparePassword(password, organizer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    organizer.password = undefined;
    organizer.__v = undefined;

    const token = jwt.sign(
      { id: organizer._id, role: "organizer" },
      process.env.JWT_SECRET,
      { expiresIn: lifetime }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json(organizer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutOrganizer = (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logout successful" });
};

export const getOrganizerProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "organizer") {
      return res.status(401).json({ error: "Invalid token" });
    }
    const organizer = await Organizer.findById(decoded.id).select(["-password", "-__v"]);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    return res.status(200).json(organizer);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};