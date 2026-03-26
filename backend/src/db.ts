import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://app:example@postgres:5432/resume_match'
})

export default pool
