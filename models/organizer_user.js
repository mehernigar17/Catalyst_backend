import mongoose from 'mongoose'

const organizerSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true
  },
  organizationType: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  website: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true })

export default mongoose.model('organizer', organizerSchema)
