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
        "Fields of Study": extracted_fields,
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
    vector = TfidfVectorizer()
    vector_res = vector.fit_transform([resume,job])
    cosine_sim = cosine_similarity(vector_res[0:1], vector_res[1:2])
    return cosine_sim.item() * 100

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



def predict(resume,job):
    clean_resume = cleanResume(resume)
    clean_job = cleanResume(job)

    # Predict Resume 
    resule_predict = Predict_Resume(clean_resume)
    # Extract Resume
    resume_extract = extract_Resume(clean_resume)
    job_extract = extract_Resume(clean_job)
    # Matching Resume Skill and Job's
    score_skill, matched_skills = matching_score(resume_extract['skill'], job_extract['skill'])
    score_education, matched_education = matching_score(resume_extract['education'], job_extract['education'])
    score_experience, matched_experience = matching_score(resume_extract['experience'], job_extract['experience'])

    # Find Similarity Using cosine
    similiraty_skill = get_ResumeSimilarity(str(resume_extract), str(job_extract))
    
    
    # Print Result
    print(f'Your clean Resume: {clean_resume}\n')
    print(f'Your clean Job: {job}\n\n\n')
    
    print(f'Your Resume Related to: {resule_predict}\n\n\n')
    
    print(f'Your Resume Skill: {resume_extract}\n')
    print(f'Your Job Skill: {job_extract}\n\n\n')
    
    print(f"Job Skill Match Score: {score_skill:.2f}%")
    print(f"Matched Skills: {', '.join(matched_skills)}\n\n")

    print(f"Job Education Match Score: {score_education:.2f}%")
    print(f"Matched education: {', '.join(matched_education)}\n\n")

    print(f"Job Experience Match Score: {score_experience:.2f}%")
    print(f"Matched experience: {', '.join(matched_experience)}\n\n")

    print(f"Job Resume match Score: {similiraty_skill:.2f}%")



with open('./job.txt', 'r', encoding='utf-8') as file:
    job = file.readlines()  # Returns a list of lines
res = pdf_read('./resume.pdf')
predict(res,str(job))