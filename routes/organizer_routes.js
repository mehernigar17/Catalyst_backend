import express from 'express'
import {
  registerOrganizer,
  loginOrganizer,
  logoutOrganizer,
  getOrganizerProfile
} from '../controllers/organizer_auth.js'
import {
  createEvent,
  getOrganizerEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  uploadEventImage,
  getPublicEvents
} from '../controllers/organizer_event.js'
import checkToken from '../middlewares/checkToken.js'
import { upload } from '../middlewares/multer.js'

const router = express.Router()

// Auth routes
router.post('/register', registerOrganizer)
router.post('/login', loginOrganizer)
router.post('/logout', checkToken, logoutOrganizer)
router.get('/profile', checkToken, getOrganizerProfile)

// Image upload route (Cloudinary)
router.post('/upload', checkToken, upload.single('image'), uploadEventImage)

// Event CRUD routes
router.get('/events/public', getPublicEvents)
router.post('/events', checkToken, upload.single('image'), createEvent)
router.get('/events', checkToken, getOrganizerEvents)
router.get('/events/:id', checkToken, getEventById)
router.put('/events/:id', checkToken, upload.single('image'), updateEvent)
router.delete('/events/:id', checkToken, deleteEvent)
router.patch('/events/:id/status', checkToken, updateEventStatus)

export default router