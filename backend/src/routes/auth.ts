import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

router.post('/register', async (req, res) => {
  try {
    const { email, password, role='recruiter' } = req.body
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users (email,password_hash,role) VALUES ($1,$2,$3) RETURNING id,email,role', [email, hash, role])
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET)
    res.json({ token, user })
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const r = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email=$1', [email])
    const user = r.rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid' })
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET)
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

export default router
