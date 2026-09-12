import Event from '../models/event.js'
import Organizer from '../models/organizer_user.js'
import cloudinary from '../utils/cloudinary.js'
import { deleteFiles } from '../utils/deleteFiles.js'

/**
 * Upload single image to Cloudinary
 */
export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'catalyst_events',
      resource_type: 'image'
    })

    deleteFiles([req.file])

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    if (req.file) deleteFiles([req.file])
    return res.status(500).json({ message: 'Image upload failed: ' + error.message })
  }
}

/**
 * Create a new event/competition for the logged-in organizer
 */
export const createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id
    const organizer = await Organizer.findById(organizerId)

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer account not found' })
    }

    let banner = req.body.banner
    let thumbnail = req.body.thumbnail || banner

    // If a file was uploaded alongside the form
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'catalyst_events',
        resource_type: 'image'
      })
      deleteFiles([req.file])
      banner = result.secure_url
      thumbnail = result.secure_url
    }

    const newEvent = new Event({
      ...req.body,
      organizerId,
      organizerName: organizer.organizationName || organizer.contactPerson,
      banner,
      thumbnail
    })

    const savedEvent = await newEvent.save()
    return res.status(201).json(savedEvent)
  } catch (error) {
    if (req.file) deleteFiles([req.file])
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Get all events for the logged-in organizer
 */
export const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.id
    const events = await Event.find({ organizerId }).sort({ createdAt: -1 })
    return res.status(200).json(events)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Get single event by ID
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.status(200).json(event)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Update an existing event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const organizerId = req.user.id

    const event = await Event.findOne({ _id: id, organizerId })
    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' })
    }

    let updateData = { ...req.body }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'catalyst_events',
        resource_type: 'image'
      })
      deleteFiles([req.file])
      updateData.banner = result.secure_url
      updateData.thumbnail = result.secure_url
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    return res.status(200).json(updatedEvent)
  } catch (error) {
    if (req.file) deleteFiles([req.file])
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Delete an event
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const organizerId = req.user.id

    const deleted = await Event.findOneAndDelete({ _id: id, organizerId })
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found or unauthorized' })
    }

    return res.status(200).json({ message: 'Event deleted successfully', id })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Update event status (Draft / Published / Closed)
 */
export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const organizerId = req.user.id

    if (!['Draft', 'Published', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, organizerId },
      { $set: { status } },
      { new: true }
    )

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' })
    }

    return res.status(200).json(event)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Get all public published events (for discover / participant)
 */
export const getPublicEvents = async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = { status: 'Published' }

    if (category && category !== 'All' && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i')
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    const events = await Event.find(filter).sort({ createdAt: -1 })
    return res.status(200).json(events)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
