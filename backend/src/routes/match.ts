import express from 'express'
import fetch from 'node-fetch'
import pool from '../db'

const router = express.Router()
const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://ml_service:8001'

router.post('/job/:jobId', async (req, res) => {
  try {
    const top_k = req.body.top_k || 10
    const r = await pool.query('SELECT id, description_text FROM jobs WHERE id=$1', [req.params.jobId])
    if (!r.rows[0]) return res.status(404).json({ error: 'job not found' })
    const jobText = r.rows[0].description_text || ''
    const embedResp = await fetch(`${ML_SERVICE}/embed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: req.params.jobId, type: 'job', text: jobText }) })
    const emb = await embedResp.json()
    const searchResp = await fetch(`${ML_SERVICE}/search`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vector: emb.vector, top_k }) })
    const results = await searchResp.json()
    res.json(results)
  } catch (err:any) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

export default router
