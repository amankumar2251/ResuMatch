import React from 'react'
export default function MatchResults({ matches=[] }){
  if (!matches.length) return <div>No matches yet</div>
  return (
    <div>
      {matches.map(m => (
        <div key={m.resume_id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
          <div><strong>Resume ID:</strong> {m.resume_id}</div>
          <div><strong>Score:</strong> {m.score}</div>
        </div>
      ))}
    </div>
  )
}
