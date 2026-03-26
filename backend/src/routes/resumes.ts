import express from 'express'
import multer from 'multer'
import pool from '../db'
import fs from 'fs'
import path from 'path'

const router = express.Router()
const upload = multer({ dest: '/tmp/uploads' })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { user_id } = req.body
    const filename = (req.file && req.file.filename) || null
    // In real app, spawn worker to parse file and extract text.
    const r = await pool.query('INSERT INTO resumes (user_id, filename, text) VALUES ($1,$2,$3) RETURNING id', [user_id, filename, ''])
    res.json({ id: r.rows[0].id })
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM resumes WHERE id=$1', [req.params.id])
    res.json(r.rows[0])
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

export default router
