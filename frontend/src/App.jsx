import React, { useState } from 'react'
import axios from 'axios'
import MatchResults from './components/MatchResults'

export default function App(){
  const [jobText, setJobText] = useState('')
  const [matches, setMatches] = useState([])

  async function handleMatch(){
    try {
      const jobResp = await axios.post('/api/jobs', { title: 'Quick', description: jobText, owner_id: 1 })
      const jobId = jobResp.data.id
      const res = await axios.post(`/api/match/job/${jobId}`, { top_k: 5 })
      setMatches(res.data)
    } catch (err) {
      console.error(err)
      alert('Error running match; ensure backend is running')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Resume Match — Demo</h1>
      <textarea value={jobText} onChange={e=>setJobText(e.target.value)} rows={8} cols={80} placeholder="Paste job description" />
      <div>
        <button onClick={handleMatch}>Find Matches</button>
      </div>
      <div style={{ marginTop: 20 }}>
        <MatchResults matches={matches} />
      </div>
    </div>
  )
}
