import warnings
warnings.filterwarnings('ignore')

# Import library
import re #regx library
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pypdf import PdfReader # Read pdf
import streamlit as st
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer


import pickle
# load skill
with open("./list/skills.pkl", "rb") as f:
    skills = pickle.load(f)
# load education    
with open("./list/education.pkl", "rb") as f:
    education = pickle.load(f)
# load experience
with open("./list/experience.pkl", "rb") as f:
    experience = pickle.load(f)

# Load the trained classifier
classfier_predict = pickle.load(open('./list/classfier.pkl', 'rb'))
tdiff_vector = pickle.load(open('./list/tdif.pkl', 'rb'))

# load model
model = SentenceTransformer("all-MiniLM-L6-v2")

def text_to_vector(text):
    return model.encode(text)




classes = ['Advocate', 'Arts', 'Automation Testing', 'Blockchain',
       'Business Analyst', 'Civil Engineer', 'Data Science', 'Database',
       'DevOps Engineer', 'DotNet Developer', 'ETL Developer',
       'Electrical Engineering', 'HR', 'Hadoop', 'Health and fitness',
       'Java Developer', 'Mechanical Engineer',
       'Network Security Engineer', 'Operations Manager', 'PMO',
       'Python Developer', 'SAP Developer', 'Sales', 'Testing',
       'Web Designing']


# Read pdf 
def pdf_read(url):
    reader = PdfReader(url)
    read = reader.pages[0]
    text = read.extract_text()
    return text


# Extract Skill
def extract_skills(text):
    extracted_skills = [skill for skill in skills if re.search(rf'\b{skill}\b', text, re.IGNORECASE)]
    return extracted_skills

#  Education Extraction Function
def extract_education(text):
    degrees = education["degrees"]
    fields_of_study = education["fields_of_study"]
    institutions = education["institutions"]
    
    extracted_degrees = [deg for deg in degrees if re.search(rf'\b{deg}\b', text, re.IGNORECASE)]
    extracted_fields = [field for field in fields_of_study if re.search(rf'\b{field}\b', text, re.IGNORECASE)]
    extracted_institutions = [inst for inst in institutions if re.search(rf'\b{inst}\b', text, re.IGNORECASE)]
    
    return {
        "Degrees": extracted_degrees,
        "Study": extracted_fields,
        "Institutions": extracted_institutions
    }

# Extract experience
def extract_experience(text):
    extracted_experience = [exp for exp in experience if re.search(rf'\b{exp}\b', text, re.IGNORECASE)]
    return extracted_experience


def extract_Resume(resume):
    skill = extract_skills(resume)
    education = extract_education(resume)
    experience = extract_experience(resume)
    
    result = {
        'skill': skill,
        'education': education,
        'experience': experience
    }

    # Convert the result to JSON format
    return result


def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)  
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText) 
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText


def get_ResumeSimilarity(resume,job):
    resume_vector = text_to_vector(resume)
    job_vector = text_to_vector(job)
    cosine_sim = cosine_similarity([resume_vector], [job_vector])[0][0]
    return cosine_sim * 100

def Predict_Resume(resume):
    # Transform the cleaned resume using the trained TfidfVectorizer
    input_features = tdiff_vector.transform([resume])
    # Make the prediction using the loaded classifier
    prediction_id = classfier_predict.predict(input_features)[0]
    return classes[prediction_id]

def matching_score(resume_, job_):
    # Convert skills to sets
    resume_set = set(resume_)
    job_set = set(job_)
    
    # Calculate intersection and union
    intersection = resume_set.intersection(job_set)
    match_score = (len(intersection) / len(job_set)) * 100  # Match based on job skills only
    
    return match_score, intersection



def predict(resume, job):
    clean_resume = cleanResume(resume)
    clean_job = cleanResume(job)

    # Predict Resume 
    resule_predict = Predict_Resume(clean_resume)
    # Extract Resume
    resume_extract = extract_Resume(clean_resume)
    job_extract = extract_Resume(clean_job)
    # Matching Resume Skill and Job's
    score_skill, matched_skills = matching_score(resume_extract['skill'], job_extract['skill'])
    score_education, matched_education = matching_score(resume_extract['education']['Study'],job_extract['education']['Study'])
    score_experience, matched_experience = matching_score(resume_extract['experience'], job_extract['experience'])
    
    # Find Similarity Using cosine
    similiraty_skill = get_ResumeSimilarity(str(resume), str(job))
    rank = ((score_skill + score_education)/200)*100
    
    # Fix the JSON serialization issue by converting sets to lists
    result = {
        "clean_resume": clean_resume,
        "clean_job": job,
        "resume_related_to": resule_predict,
        "resume_skills": resume_extract,
        "job_skills": job_extract,
        "job_skill_match_score": f"{score_skill:.2f}%",
        "matched_skills": list(matched_skills),  # Convert set to list
        "job_education_match_score": f"{score_education:.2f}%",
        "matched_education": list(matched_education),  # Convert set to list
        "job_experience_match_score": f"{score_experience:.2f}%",
        "matched_experience": list(matched_experience),  # Convert set to list
        "job_resume_match_score": f"{similiraty_skill:.2f}%",
        "resume_rank": f"{rank:.2f}%"
    }

    return result





def resume_result(resume_text,job):
    return predict(resume_text,str(job))
    