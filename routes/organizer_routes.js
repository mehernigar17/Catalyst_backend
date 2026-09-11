import express from 'express'
import { registerOrganizer, loginOrganizer, logoutOrganizer, getOrganizerProfile } from '../controllers/organizer_auth.js'
import checkToken from '../middlewares/checkToken.js'

const router = express.Router()

router.post('/register', registerOrganizer)
router.post('/login', loginOrganizer)
router.post('/logout', checkToken, logoutOrganizer)
router.get('/profile', checkToken, getOrganizerProfile)

export default router