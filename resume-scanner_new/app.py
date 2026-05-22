from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import fitz  # PyMuPDF
import spacy
from bson import ObjectId
import numpy as np

# Flask app setup
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["hiresmart"]
job_collection = db["jobpostings"]
category_collection = db["categories"]
company_collection = db["companies"]
user_collection = db["users"]
log_collection = db["logs"]

# Recursively convert ObjectIds to strings
def convert_objectid(obj):
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

# Enrich jobs with category name
def enrich_jobs_with_category(jobs):
    for job in jobs:
        category_id = job.get("jobCategory")
        if category_id:
            cat = category_collection.find_one({"_id": ObjectId(category_id)}, {"category_name": 1})
            if cat:
                job["category_name"] = cat["category_name"]
    return jobs

def enrich_jobs_with_company(jobs):
    for job in jobs:
        company_id = job.get("companyId")
        if company_id:
            company = company_collection.find_one(
                {"_id": ObjectId(company_id)},
                {"name": 1, "logo": 1}
            )
            if company:
                job["companyId"] = convert_objectid(company)
    return jobs


# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

# Extract name and skills using spaCy
def extract_resume_data(text):
    doc = nlp(text)

    # Extract name
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    if not name:
        # fallback to most frequent noun chunk
        noun_chunks = [chunk.text.strip().lower() for chunk in doc.noun_chunks if len(chunk.text.strip()) <= 40]
        if noun_chunks:
            name = max(set(noun_chunks), key=noun_chunks.count)

    # Extract skill phrases
    skills = set()
    for chunk in doc.noun_chunks:
        token = chunk.root
        if token.pos_ in ["NOUN", "PROPN", "ADJ"] and len(chunk.text.strip()) <= 40:
            skills.add(chunk.text.lower().strip())

    return {
        "name": name.strip(),
        "skills": list(skills)
    }

# Recommend jobs using cosine similarity
def recommend_jobs(resume_skills, title, jobs, top_n=3):
    job_texts = []
    for job in jobs:
        skills_text = " ".join([s.get("skill", "").lower() for s in job.get("skills", [])])

        job_texts.append(f"{job.get('jobTitle', '')} {job.get('jobDescription', '')} {skills_text}" * 3)
    print("Job Texts:", job_texts)
    print("Resume Skills:", resume_skills)

    resume_text = f"{title} {' '.join(resume_skills)}" * 3

    tfidf = TfidfVectorizer(stop_words='english', min_df=1)
    vectors = tfidf.fit_transform(job_texts + [resume_text])
    cosine_sim = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    top_indices = cosine_sim.argsort()[::-1][:top_n]

    return [jobs[i] for i in top_indices]

# Resume upload and recommendation endpoint
@app.route("/recommend", methods=["POST"])
def recommend():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    resume = request.files["resume"]
    file_path = os.path.join(UPLOAD_FOLDER, secure_filename(resume.filename))
    resume.save(file_path)

    try:
        # Extract resume content
        text = extract_text_from_pdf(file_path)

        parsed = extract_resume_data(text)


        resume_skills = parsed.get("skills", [])

        resume_title = parsed.get("name", "")


        if not resume_skills or not resume_title:
            return jsonify({"error": "Could not extract sufficient info from resume"}), 400

        # Fetch and clean job postings
        jobs_raw = list(job_collection.find({"isActive": { "$in": [True, "true", 1] }}))
        print(len(jobs_raw),"length")

        jobs_clean = [convert_objectid(job) for job in jobs_raw]

        if not jobs_clean:
            return jsonify({"error": "No jobs available"}), 404
        
        print(jobs_clean)

        # Recommend and enrich
        # top_jobs = recommend_jobs(resume_skills, resume_title, jobs_clean, top_n=3)
        # enriched = enrich_jobs_with_category(top_jobs)

        # return jsonify({"jobs": enriched})
        top_jobs = recommend_jobs(resume_skills, resume_title, jobs_clean, top_n=3)
        top_jobs = enrich_jobs_with_category(top_jobs)
        top_jobs = enrich_jobs_with_company(top_jobs)

        return jsonify({"jobs": top_jobs})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/recommend/jobs/<user_id>", methods=["GET"])
def recommend_jobs_by_views(user_id):
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # -----------------------------
        # Fetch All Logs
        # -----------------------------
        all_logs = list(log_collection.find())

        if not all_logs:
            return jsonify({"error": "No interaction data available"}), 404

        # -----------------------------
        # Build User-Job Matrix
        # -----------------------------
        user_ids = list(set(str(log["user_id"]) for log in all_logs))
        job_ids = list(set(str(
            log["job_id"]["_id"] if isinstance(log["job_id"], dict)
            else log["job_id"]
        ) for log in all_logs))

        user_index = {uid: i for i, uid in enumerate(user_ids)}
        job_index = {jid: i for i, jid in enumerate(job_ids)}

        interaction_matrix = np.zeros((len(user_ids), len(job_ids)))

        for log in all_logs:
            uid = str(log["user_id"])
            jid = log["job_id"]["_id"] if isinstance(log["job_id"], dict) else log["job_id"]
            jid = str(jid)

            interaction_matrix[user_index[uid]][job_index[jid]] += 1

        # -----------------------------
        # Compute Cosine Similarity
        # -----------------------------
        similarity_matrix = cosine_similarity(interaction_matrix)

        target_user_str = str(user_id)
        if target_user_str not in user_index:
            return jsonify({"error": "User has no interactions"}), 404

        target_idx = user_index[target_user_str]

        similarity_scores = similarity_matrix[target_idx]

        # Get top similar users (excluding self)
        similar_users_idx = similarity_scores.argsort()[::-1][1:4]

        # -----------------------------
        # Get Jobs From Similar Users
        # -----------------------------
        target_user_jobs = set()
        for j in range(len(job_ids)):
            if interaction_matrix[target_idx][j] > 0:
                target_user_jobs.add(job_ids[j])

        recommended_jobs = []

        for idx in similar_users_idx:
            similarity_score = similarity_scores[idx]
            if similarity_score <= 0:
                continue

            for j in range(len(job_ids)):
                if interaction_matrix[idx][j] > 0 and job_ids[j] not in target_user_jobs:
                    job = job_collection.find_one({"_id": ObjectId(job_ids[j])})
                    if job and job.get("isActive"):
                        job["similarity_score"] = float(similarity_score)
                        recommended_jobs.append(job)

        # Remove duplicates
        unique_jobs = {str(job["_id"]): job for job in recommended_jobs}
        final_jobs = list(unique_jobs.values())

        # Sort by similarity score
        final_jobs.sort(key=lambda x: x["similarity_score"], reverse=True)

        # Convert ObjectIds
        final_jobs = [convert_objectid(job) for job in final_jobs]
        final_jobs = enrich_jobs_with_category(final_jobs)
        final_jobs = enrich_jobs_with_company(final_jobs)

        return jsonify({
            "recommendations": final_jobs[:5]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
