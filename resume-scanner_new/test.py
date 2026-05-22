import fitz  # PyMuPDF
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Read text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# Extract entities like name, email, skills (basic example)
def extract_resume_data(text):
    doc = nlp(text)
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break
    
    skills_list = ["python", "java", "react", "node", "sql", "machine learning", "django", "flask"]
    skills_found = [skill for skill in skills_list if skill.lower() in text.lower()]
    
    return {
        "name": name,
        "skills": list(set(skills_found))
    }

# Example usage
pdf_path = "./uploads/resume_2025.pdf"
text = extract_text_from_pdf(pdf_path)
data = extract_resume_data(text)
print(data)
