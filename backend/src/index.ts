import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import jobRoutes from './routes/jobs'
import resumeRoutes from './routes/resumes'
import matchRoutes from './routes/match'

dotenv.config()
const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/match', matchRoutes)

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Backend listening on ${port}`))
