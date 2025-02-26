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


# Apply on my resume
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


def get_ResumeSimilarity(myResume,jobDescription):
    vector = TfidfVectorizer()
    tfidf_vector = vector.fit_transform([myResume,jobDescription])
    cosine_sim = cosine_similarity(tfidf_vector[0:1], tfidf_vector[1:2])