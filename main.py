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

    #time to build the specific SQL query using the function arguments
    #that fastAPI filled in for us from reading the GET request.

    query= """
        SELECT country, region, happiness_rank, {metric_col}
        FROM happiness
        WHERE year = :year
        {region_filter} 
        ORDER BY happiness_rank
    """.format(
        metric_col=metric, #metric_col is basically the particular metric user wants to know about the region in question.
        region_filter="AND region = :region" if region else "" #we could've avoided this and written AND region = :region directly above in the query -- below WHERE year= :year -- itself. But we wanted to guard against the rows that may have no region so we did this.
    )

    params = {"year": year, "region": region} #to equate query variable to our Python arguments!

    #we keep a connection to postgres open, and execute our query
    with engine.connect() as conn:
        rows = conn.execute(text(query), params).fetchall() #now, rows variable holds our result in the form of a bunch of table rows.

    #time to convert and return results as website readable JSON format

    #convert into JSON-friendly python dict
    #since "rows" holds output as a bunch of rows, we do list comprehension to loop over all rows.

    return {
        "year": year,
        "region": region,
        "metric": metric,
        "data": [
            {
                "country": r[0],
                "region": r[1],
                "rank": r[2],
                "value": r[3] #this is whatever metric the user selected.
            }
            for r in rows
        ]
    }

#rather than hardcoding the sliders in the frontend with arbitrary values,
# we populate the year slider and region dropdown with whatever values are actually
# in the database. 
@app.get("/api/filters") #defines the API call via which React can call get_filter() 
def get_filters():
    with engine.connect() as conn:
        years = [
            r[0] for r in conn.execute(
                text("SELECT DISTINCT year FROM happiness ORDER BY year") #we write our custom query to retrieve only distinct year values from HAPPINESS table!
            ).fetchall()
        ]
        regions = [
            r[0] for r in conn.execute(
                text("SELECT DISTINCT region from HAPPINESS ORDER BY region") #custom query to retrieve only distinct region values.
            ).fetchall()
        ]
    # Returns e.g. {"years": [2015,2016,2017,2018,2019], "regions": [...]}
    # React uses this to build the slider and dropdown options dynamically
    return {"years": years, "regions": regions} #finally we return a JSON dict-type result!








    