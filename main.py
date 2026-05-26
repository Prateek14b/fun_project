from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

app = FastAPI() #creates a fastAPI app instance.

#now we use CORS (Cross-Origin Resource Sharing), which is a browser security rule that blocks
#requests coming from different ports than what we allowed.
#This middleware tells FASTAPI to explicitly allow requests only from port 300 (the default React port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], #only allow requests from React APP
    allow_methods=["GET"], #only allow GET requests
    allow_headers=["*"], #allow any headers
)

