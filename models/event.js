import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organizer',
    required: true
  },
  organizerName: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Technology'
  },
  shortDescription: {
    type: String
  },
  fullDescription: {
    type: String
  },
  banner: {
    type: String
  },
  thumbnail: {
    type: String
  },
  educationLevels: {
    type: [String],
    default: ['Open to All']
  },
  participationType: {
    type: String,
    enum: ['Individual', 'Team', 'Both'],
    default: 'Team'
  },
  minTeamSize: {
    type: Number,
    default: 1
  },
  maxTeamSize: {
    type: Number,
    default: 1
  },
  eligibilityRules: {
    type: String
  },
  registrationOpens: {
    type: String
  },
  deadline: {
    type: String
  },
  eventDate: {
    type: String
  },
  eventType: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online'
  },
  location: {
    type: String
  },
  prizes: {
    type: String
  },
  rules: {
    type: String
  },
  timeline: [{
    stage: { type: String },
    date: { type: String },
    desc: { type: String }
  }],
  registrationUrl: {
    type: String
  },
  contactEmail: {
    type: String
  },
  additionalContact: {
    type: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Closed'],
    default: 'Draft'
  },
  bookmarks: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('event', eventSchema)
