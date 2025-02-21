import warnings
warnings.filterwarnings('ignore')

import spacy
from pypdf import PdfReader


url = './resume.pdf'
reader = PdfReader(url)
read = reader.pages[0]
text = read.extract_text()


nlp = spacy.load("en_core_web_sm")
print("Model Loaded Successfully!")

import spacy
import re

nlp = spacy.load("en_core_web_sm")


doc = nlp(text)

print(doc)
