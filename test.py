test = "{\"clean_resume\": \" MUKKARAM AHMAD KHAN CONTACT 923224705198 Lahore Pakistan mukkaramahmad khan www linkedin com in mukkaram ahmad khan 31a2b6310 PROFILE Dedicated BSCS student with a strong academic background seeking opportunities to apply theoretical knowledge and learn practical skills in software development Seeking a challenging position where I can develop my educational skills further and to be an effective team member I am keenly interested to work in career oriented organization to acquire experience and professional skills and become a radical part of a challenging and progressive organization SKILLS Programming Languages C PYTHON MY SQL ASSEMBLY C JAVASCRIPT HTML CSS DA Concepts DSA OOP SDLC COAL DLD Software MS WORD MS POWERPOINT MS EXCEL Soft Skills TEAMWORK EFFECTIVE COMMUNICATIO N PROBLEM SOLVING EXPERIENCE Home Tuitions 2020 still working 3 Years Working Experience in Home Tuition and currently I am doing that Lahore Garrison University 2022 still working 3 years Working Experience as a Teacher Assistant and currently I am doing that HBPO Solutions 2 Months Working Experience in Call Centre as an Agent Pakistan Kidney and Liver Institute and Research Center Official August 2024 October 2024 2 months I ve completed my internship in the IT Department as an IT Support Technician focusing on Networking and Web Development at PKLI eager to learn and contribute EDUCATION Graduation Lahore Garrisson University \", \"clean_job\": \"Job Title: Data Scientist  \\nLocation: Remote / On-site (Karachi, Pakistan)  \\nCompany: TechNova Analytics  \\nJob Type: Full-Time  \\n---\\n About the Role:\\nWe\\u2019re looking for a passionate and analytical Data Scientist to join our growing analytics team. You  \\nwill play a key role in transforming raw data into actionable insights to support business decision-\\nmaking and strategy development.\\n---\\n Requirements:\\nEducation:\\n- Bachelor's degree (BS) in Computer Science, Data Science, Statistics, Mathematics, or a related \\nfield.\\nExperience:\\n- 2+ years of experience working in a data science or analytics role.\\nSkills:\\n- Proficiency in Python and SQL.\\n- Experience with machine learning libraries such as Scikit-learn, TensorFlow, or PyTorch.\\n- Strong knowledge of statistical analysis and data visualization tools (e.g., Tableau, Power BI, or \\nMatplotlib).\\n- Familiarity with cloud platforms (AWS, GCP, or Azure).\\n- Experience with big data tools like Spark or Hadoop is a plus.\\n- Solid understanding of data preprocessing and feature engineering.\\n---\\n Key Responsibilities:\\n- Analyze large datasets to discover trends and patterns.\\n- Build predictive models and machine learning algorithms.\\n- Collaborate with cross-functional teams to understand business objectives.\\n- Develop data visualization dashboards to present insights.\\n- Ensure data integrity and improve data collection strategies.\\n---\\n Benefits:\\n- Competitive salary\\n- Flexible working hours\\n- Health insurance\\n- Learning and development opportunities\\n- Annual performance bonuses\", \"resume_related_to\": \"Java Developer\", \"resume_skills\": {\"skill\": [\"SQL\", \"C\", \"Assembly\", \"OOP\", \"JavaScript\", \"C++\", \"Python\", \"CSS\", \"HTML\"], \"education\": {\"Degrees\": [\"BE\", \"MS\", \"Bscs\"], \"Study\": [\"Web Development\"], \"Institutions\": [\"University\", \"Institute\"]}, \"experience\": [\"Experience\", \"Internship\"]}, \"job_skills\": {\"skill\": [\"AWS\", \"SQL\", \"Hadoop\", \"PyTorch\", \"Big Data\", \"Statistical Analysis\", \"Azure\", \"Machine Learning\", \"TensorFlow\", \"Data Science\", \"Python\"], \"education\": {\"Degrees\": [\"BS\"], \"Study\": [\"Computer Science\", \"Data Science\", \"Machine Learning\", \"Mathematics\", \"Statistics\"], \"Institutions\": []}, \"experience\": [\"Experience\", \"Years of Experience\", \"Data Scientist\", \"2+ years of experience\"]}, \"job_skill_match_score\": \"18.18%\", \"matched_skills\": [\"SQL\", \"Python\"], \"job_education_match_score\": \"0.00%\", \"matched_education\": [], \"job_experience_match_score\": \"25.00%\", \"matched_experience\": [\"Experience\"], \"job_resume_match_score\": \"51.65%\", \"resume_rank\": \"9.09%\"}"

from flair.data import Sentence
from flair.models import SequenceTagger

import re
tagger = SequenceTagger.load("ner")

def predict_name(text):
    sentence = Sentence(text)
    tagger.predict(sentence)
    for entity in sentence.get_spans("ner"):
        if entity.tag == "PER":  # PER = Person
            return entity.text

def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)  
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText) 
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText


extracted_resume = cleanResume(test)

user_name = predict_name(extracted_resume)
print(user_name)