#Use official Python image as base
FROM python:3.11-slim

#set working directory inside container
WORKDIR /app

#Copy requirements file first (so Docker caches this layer). this copies
#requirements.txt into "." (destination) which is the current working directory inside container!
COPY requirements.txt . 

#Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

#Copy the rest of the backend code
COPY main.py .

COPY fun_project.py .

COPY 2015.csv 2016.csv 2017.csv 2018.csv 2019.csv ./

COPY happiness_cleaned.csv .

#rUN THE fastAPI app with uvicorn
CMD ["sh", "-c", "python fun_project.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
