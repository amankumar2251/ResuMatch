import express from 'express'
import pool from '../db'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { title, description, owner_id } = req.body
    const r = await pool.query('INSERT INTO jobs (title, description_text, owner_id) VALUES ($1,$2,$3) RETURNING id', [title, description, owner_id])
    res.json({ id: r.rows[0].id })
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM jobs WHERE id=$1', [req.params.id])
    res.json(r.rows[0])
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

export default router
