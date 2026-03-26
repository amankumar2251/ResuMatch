from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os
import numpy as np
import psycopg2
import json

DATABASE_URL = os.environ.get('DATABASE_URL','postgres://app:example@postgres:5432/resume_match')

app = FastAPI()
# load model (this will download model weights on first run)
model = SentenceTransformer('all-mpnet-base-v2')

class EmbedRequest(BaseModel):
    id: str
    type: str
    text: str

class SearchRequest(BaseModel):
    vector: list
    top_k: int = 10

# connect to Postgres
conn = psycopg2.connect(DATABASE_URL)

@app.post('/embed')
def embed(req: EmbedRequest):
    vec = model.encode(req.text, show_progress_bar=False)
    # store into embeddings table (pgvector)
    with conn.cursor() as cur:
        # psycopg2 does not natively support pgvector; simplest approach: convert to list and use literal
        cur.execute("INSERT INTO embeddings (source_type, source_id, vector) VALUES (%s,%s,%s) ON CONFLICT (source_id) DO UPDATE SET vector = EXCLUDED.vector", (req.type, req.id, vec.tolist()))
        conn.commit()
    return {'id': req.id, 'vector': vec.tolist()}

@app.post('/search')
def search(req: SearchRequest):
    with conn.cursor() as cur:
        # Order by distance operator <=> (pgvector). The SQL below assumes the driver will accept Python list for the vector param.
        cur.execute("SELECT source_id, 1 - (vector <=> %s::vector) AS score FROM embeddings WHERE source_type='resume' ORDER BY vector <=> %s::vector LIMIT %s", (req.vector, req.vector, req.top_k))
        rows = cur.fetchall()
    return [{'resume_id': r[0], 'score': float(r[1])} for r in rows]
