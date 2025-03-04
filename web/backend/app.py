from fastapi import FastAPI,Depends,HTTPException,Form
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import model 
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import shutil
import os   
from PyPDF2 import PdfReader
from predict import resume_result



app = FastAPI()
model.Base.metadata.create_all(bind=engine)

# adding Cors url
origins = [
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def pdf_read(url):
    reader = PdfReader(url)
    read = reader.pages[0]
    text = read.extract_text()
    return text


def delete_existing_files():
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")


@app.post("/upload")
async def upload(
    resume: UploadFile = File(...), 
    job: UploadFile = File(...)  # Job file is optional
):
    try:
        if not resume.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed for resume")

        # Validate job file if provided
        if job and not job.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed for job")

        delete_existing_files()  # Delete existing files

        resume_location = os.path.join(UPLOAD_DIR, resume.filename)
        with open(resume_location, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        job_location = os.path.join(UPLOAD_DIR, job.filename)
        with open(job_location, "wb") as buffer:
            shutil.copyfileobj(job.file, buffer)
            
        # Process the resume file
        extracted_resume = pdf_read(resume_location)
        extracted_job = pdf_read(job_location)

        result = resume_result(extracted_resume,extracted_job)

        return {
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")