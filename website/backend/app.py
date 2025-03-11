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
from flair.models import SequenceTagger
from flair.data import Sentence
import json

import warnings
warnings.filterwarnings('ignore')


app = FastAPI()
model.Base.metadata.create_all(bind=engine)
tagger = SequenceTagger.load("ner")


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


def predict_name(text):
    sentence = Sentence(text)
    tagger.predict(sentence)
    for entity in sentence.get_spans("ner"):
        if entity.tag == "PER":  # PER = Person
            return entity.text



@app.post("/upload")
async def upload(
    resume: UploadFile = File(...), 
    job: UploadFile = File(...),  # Job file is optional
    db: Session = Depends(get_db)
):
    from predict import resume_result
    
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
        user_name = predict_name(extracted_resume) 

        db_result = model.ResumeResult(
            name=user_name,
            result_json=json.dumps(result),
            rank = result['resume_rank']
        )
        db.add(db_result)
        db.commit()
        db.refresh(db_result)
        return {
            "message": "Files uploaded and processed successfully",
            "db_id": db_result.id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    


@app.get("/results/{id}")
def get_result(id: int, db: Session = Depends(get_db)):
    result = db.query(model.ResumeResult).filter(model.ResumeResult.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {
        "id": result.id,
        "name":result.name,
        "result": json.loads(result.result_json)  # Convert back to JSON
    }


@app.get("/all_result")
def all_result(db: Session = Depends(get_db)):
    result = db.query(model.ResumeResult).all()
    return result
