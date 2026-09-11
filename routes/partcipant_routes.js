import express from 'express'
import { registerParticipant, loginParticipant, logoutParticipant, getParticipantProfile } from '../controllers/participant_auth.js'
import checkToken from '../middlewares/checkToken.js'

const router = express.Router()

router.post('/register', registerParticipant)
router.post('/login', loginParticipant)
router.post('/logout', checkToken, logoutParticipant)
router.get('/profile', checkToken, getParticipantProfile)

export default router