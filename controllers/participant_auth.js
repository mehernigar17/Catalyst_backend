import Participant from '../models/participant_user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerParticipant = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const participant = await Participant.create({
      ...req.body,
      password: hashedPassword
    })
    res.status(201).json(participant)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginParticipant = async (req, res) => {
  try {
    const { email, password } = req.body

    const participant = await Participant.findOne({ email })
    if (!participant) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, participant.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { id: participant._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({ token, participant })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}