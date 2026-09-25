import express from 'express'
import { registerParticipant, loginParticipant, logoutParticipant, getParticipantProfile } from '../controllers/participant_auth.js'
import checkToken from '../middlewares/checkToken.js'
import { toggleBookmark, getBookmarks } from '../controllers/participant_bookmark.js'

const router = express.Router()

router.post('/register', registerParticipant)
router.post('/login', loginParticipant)
router.post('/logout', checkToken, logoutParticipant)
router.get('/profile', checkToken, getParticipantProfile)

//bookmark
router.post('/bookmarks/:eventId', checkToken, toggleBookmark)
router.delete('/bookmarks/:eventId', checkToken, toggleBookmark)
router.get('/bookmarks', checkToken, getBookmarks)

export default router