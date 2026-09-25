import Participant from '../models/participant_user.js'
import Event from '../models/event.js'

export const toggleBookmark = async (req, res) => {
  try {
    const { eventId } = req.params
    const participant = await Participant.findById(req.user.id)
    if (!participant) return res.status(404).json({ message: 'Participant not found' })

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const index = participant.bookmarks.findIndex((id) => id.toString() === eventId)
    if (index === -1) {
      participant.bookmarks.push(eventId)
      event.bookmarks = (event.bookmarks || 0) + 1
      await Promise.all([participant.save(), event.save()])
      return res.status(200).json({ bookmarked: true })
    }
    participant.bookmarks.splice(index, 1)
    event.bookmarks = Math.max(0, (event.bookmarks || 0) - 1)
    await Promise.all([participant.save(), event.save()])
    return res.status(200).json({ bookmarked: false })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getBookmarks = async (req, res) => {
  try {
    const participant = await Participant.findById(req.user.id).populate('bookmarks')
    if (!participant) return res.status(404).json({ message: 'Participant not found' })
    return res.status(200).json(participant.bookmarks || [])
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}