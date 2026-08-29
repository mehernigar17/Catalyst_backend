import Organizer from '../models/organizer_user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerOrganizer = async (req, res) => {
  try {
    const { organizationName, organizationType, contactPerson, email, password } = req.body

    if (!organizationName || !organizationType || !contactPerson || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' })
    }

    const existingOrganizer = await Organizer.findOne({ email })
    if (existingOrganizer) {
      return res.status(400).json({ message: 'An organizer with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const organizer = await Organizer.create({
      ...req.body,
      password: hashedPassword
    })

    const token = jwt.sign(
      { id: organizer._id, role: 'organizer' },
      process.env.JWT_SECRET || 'catalyst_jwt_secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, organizer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const organizer = await Organizer.findOne({ email })
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer account not found' })
    }

    const isMatch = await bcrypt.compare(password, organizer.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: organizer._id, role: 'organizer' },
      process.env.JWT_SECRET || 'catalyst_jwt_secret',
      { expiresIn: '7d' }
    )

    res.status(200).json({ token, organizer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
