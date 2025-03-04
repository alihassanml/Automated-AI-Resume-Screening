from flair.models import SequenceTagger
from flair.data import Sentence
from pypdf import PdfReader # Read pdf
tagger = SequenceTagger.load("ner")


def pdf_read(url):
    reader = PdfReader(url)
    read = reader.pages[0]
    text = read.extract_text()
    return text

url = 'resume.pdf'
sentence = str(pdf_read(url))

tagger.predict(sentence)
for entity in sentence.get_spans('ner'):
    if entity.tag == "PER":  # PER = Person
        print(entity.text)