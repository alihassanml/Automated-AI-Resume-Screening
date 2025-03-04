from flair.models import SequenceTagger
from flair.data import Sentence
from pypdf import PdfReader  # Read pdf

# Load NER tagger
tagger = SequenceTagger.load("ner")


def pdf_read(url):
    reader = PdfReader(url)
    read = reader.pages[0]
    text = read.extract_text()
    return text


url = "resume.pdf"
text = pdf_read(url)

# Convert text into a Sentence object
sentence = Sentence(text)

# Perform Named Entity Recognition
tagger.predict(sentence)

# Extract and print person's name
for entity in sentence.get_spans("ner"):
    if entity.tag == "PER":  # PER = Person
        print(entity.text)
