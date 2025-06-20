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
import re
from PyPDF2 import PdfReader
from flair.models import SequenceTagger
from flair.data import Sentence
import json
from email_letter import send_job_offer_email
import threading
import warnings
warnings.filterwarnings('ignore')

from deep_translator import GoogleTranslator
from deep_translator import single_detection


app = FastAPI()
model.Base.metadata.create_all(bind=engine)
tagger = SequenceTagger.load("ner")


# adding Cors url
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ allow all origins
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
        
def language_detector(text):
    lang = single_detection(text, api_key='d976110bbdcfff622131eebb11c72f51')
    return lang



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
        detect = language_detector(extracted_resume)
        if detect == 'en':
            pass
        else:
            extracted_resume = GoogleTranslator(source='auto', target='en').translate(extracted_resume)  # output -> Weiter so, du bist großartig

        result = resume_result(extracted_resume,extracted_job)
        print('------Getting Result---------------')
        user_name = predict_name(extracted_resume) 
        print('------Getting Name---------------')


        if float(result['resume_rank'].replace('%', '')) >= 50:
            print('------Sending Email ---------------')
            email_pattern = r'[a-zA-Z0-9_.+-]+@'
            emails = re.findall(email_pattern, extracted_resume)
            emails = f'{emails[0]}gmail.com' if emails else 'unknown@gmail.com'
            send_job_offer_email(emails,user_name,result['resume_related_to'])
            print('------Sending Done ---------------')

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



@app.post("/batch_predict")
def batch_predict( 
    db: Session = Depends(get_db)
):
    from predict import resume_result

    BATCH_DIR = os.path.join(UPLOAD_DIR, "batch")
    os.makedirs(BATCH_DIR, exist_ok=True)
    job = './job.pdf'

    results = []
    try:
        if not job.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files allowed for job")

        # Save the job file
        job_path = os.path.join(BATCH_DIR, job.filename)
        with open(job_path, "wb") as buffer:
            shutil.copyfileobj(job.file, buffer)

        extracted_job = pdf_read(job_path)

        # Process each CV in the batch folder
        for file_name in os.listdir(BATCH_DIR):
            if file_name.endswith(".pdf") and file_name != job.filename:
                try:
                    cv_path = os.path.join(BATCH_DIR, file_name)
                    extracted_resume = pdf_read(cv_path)
                    result = resume_result(extracted_resume, extracted_job)

                    user_name = predict_name(extracted_resume)
                    email_pattern = r'[a-zA-Z0-9_.+-]+@'
                    emails = re.findall(email_pattern, extracted_resume)
                    emails = f'{emails[0]}gmail.com' if emails else 'unknown@gmail.com'

                    # Send email only if rank >= 50
                    if float(result['resume_rank'].replace('%', '')) >= 50:
                        send_job_offer_email(emails, user_name, result['resume_related_to'])

                    # Save to DB
                    db_result = model.ResumeResult(
                        name=user_name or "unknown",
                        result_json=json.dumps(result),
                        rank=result['resume_rank']
                    )
                    db.add(db_result)
                    db.commit()
                    db.refresh(db_result)

                    results.append({
                        "cv": file_name,
                        "rank": result['resume_rank'],
                        "db_id": db_result.id
                    })
                except Exception as e:
                    results.append({
                        "cv": file_name,
                        "error": str(e)
                    })

        return {
            "message": "Batch processing complete",
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")
