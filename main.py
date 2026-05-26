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

#-----Database connection via SQLAlchemy's create_engine(); we use postgres container's unique database URL to securely connect.----
#-----port 5432 is whene Docker is exposing Postgres container on ----
engine = create_engine("postgresql://admin:password@localhost:5432/happinessdb")

# --- Routes -----------
# @app.get("/api/stats") is the standard form for a HTTP request to fastAPI
#we need to define the script/behavior for converting the GET request 
#into a valid SQL query!
#so we define a function get_stats() that takes care of precisely this conversion.

#FASTapi automatically parses the incoming GET request, reads the required request and fills in the arguments for get_stats() accordingly.
@app.get("/api/stats")
def get_stats(year: int=2019, region: str=None, metric: str= "happiness_score"):

    #first things first, we have to prevent SQL injections, so we
    #define only the allowed columns for the user to query over.

    allowed_metrics = {
        "happiness_score", "gdp_per_capita", "social_support", 
        "life_expectancy", "freedom", "corruption", "generosity"
    }

    if metric not in allowed_metrics:
        metric = "happiness_score" #fall back to default column/metric if an invalid metric is specified in request.

    
    