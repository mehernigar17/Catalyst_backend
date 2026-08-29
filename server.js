import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import participantRoutes from './routes/partcipant_routes.js'
import organizerRoutes from './routes/organizer_routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

app.use('/api/participant', participantRoutes)
app.use('/api/organizer', organizerRoutes)

app.get('/', (req, res) => {
  res.send('Catalyst Backend Server is running!')
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('Connection Error:', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})