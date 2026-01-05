# chat_model.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ==========================================
# 1. THE BRAIN (EXPANDED KNOWLEDGE BASE)
# ==========================================
knowledge_base = [
    # --- IDENTITY & BIO ---
    ("Who are you?", "about"),
    ("Tell me about yourself", "about"),
    ("What is your name?", "about"),
    ("Are you a developer?", "about"),
    ("Intro", "about"),
    ("Summary", "about"),

    # --- EDUCATION ---
    ("Where did you study?", "education"),
    ("What is your college?", "education"),
    ("DTU", "education"),
    ("Delhi Technological University", "education"),
    ("What is your branch?", "education"),
    ("ECE", "education"),
    ("When will you graduate?", "education"),
    ("Degree details", "education"),

    # --- ACADEMIC STATS ---
    ("What was your JEE rank?", "stats"),
    ("JEE Mains AIR", "stats"),
    ("Class 12th marks", "stats"),
    ("Class 10th marks", "stats"),
    ("School grades", "stats"),
    ("Academic achievements", "stats"),

    # --- SKILLS (Specifics) ---
    ("What are your skills?", "skills"),
    ("Tech stack", "skills"),
    ("Do you know Python?", "skills_python"),
    ("Java skills", "skills_java"),
    ("Web development skills", "skills_web"),
    ("Do you know React?", "skills_web"),
    ("FastAPI", "skills_backend"),
    ("Database skills", "skills_db"),
    ("Machine Learning", "skills_ml"),

    # --- WORK/PROJECTS GENERAL ---
    ("Show me your projects", "work"),
    ("Portfolio", "work"),
    ("What have you built?", "work"),
    ("Selected work", "work"),

    # --- SMARTFLEX ---
    ("Tell me about SmartFlex", "smartflex"),
    ("What is SmartFlex?", "smartflex"),
    ("Scheduling system", "smartflex"),
    ("Timetable generator", "smartflex"),
    ("OR-Tools project", "smartflex"),
    ("SmartFlex tech stack", "smartflex"),

    # --- HCM (Human Like CMS) ---
    ("Tell me about HCM", "hcm"),
    ("What is Human Like CMS?", "hcm"),
    ("Content Management System", "hcm"),
    ("NLP project", "hcm"),
    ("Context aware engine", "hcm"),

    # --- SPOTIFY CLONE ---
    ("Tell me about SpotifyC", "spotify"),
    ("Sonic UI", "spotify"),
    ("Music player clone", "spotify"),
    ("Spotify redesign", "spotify"),
    ("Frontend project", "spotify"),

    # --- CONTACT ---
    ("How can I contact you?", "contact"),
    ("Email address", "contact"),
    ("Phone number", "contact"),
    ("Hire you", "contact"),
    ("Let's connect", "contact"),
    ("Socials", "contact"),
]

corpus = [item[0] for item in knowledge_base]
intents = [item[1] for item in knowledge_base]

class ChatBotAI:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(lowercase=True, stop_words='english')
        self.vector_db = None

    def train(self):
        self.vector_db = self.vectorizer.fit_transform(corpus)
        print("Semantic AI Brain Trained (Expanded Knowledge).")

    def get_response(self, user_text):
        user_vec = self.vectorizer.transform([user_text])
        similarities = cosine_similarity(user_vec, self.vector_db).flatten()
        
        best_index = np.argmax(similarities)
        best_score = similarities[best_index]
        best_intent = intents[best_index]

        # Threshold logic
        if best_score < 0.25: # Lowered slightly to catch more variations
            return {
                "text": "I don't have that specific information in my database yet. However, I'd love to discuss it personally.",
                "action": "offer_contact",
                "label": "Connect with Avi",
                "target": "open-contact-modal"
            }
            
        return self.generate_action(best_intent)

    def generate_action(self, intent):
        # RESPONSES WITH SMART ACTIONS
        responses = {
            "about": {
                "text": "I am Avi Gupta, a Software Engineer & Hardware Enthusiast at DTU. I build digital experiences using Python, Java, and Modern Web Tech.",
                "action": "scroll_to",
                "label": "Read Full Bio",
                "target": "#about"
            },
            "education": {
                "text": "I am pursuing a B.Tech in Electronics & Communication (ECE) at Delhi Technological University (2024-2028).",
                "action": "scroll_to",
                "label": "View Education",
                "target": ".education-grid"
            },
            "stats": {
                "text": "I hold a strong academic record: JEE Mains Rank 15,057, Class 12th (97.2%), and Class 10th (94%).",
                "action": "scroll_to",
                "label": "View Timeline",
                "target": "#journey"
            },
            "skills": {
                "text": "My arsenal includes Python, Java, C, HTML/CSS/JS, React, FastAPI, and Databases like MySQL & MongoDB.",
                "action": "scroll_to",
                "label": "Inspect Stack",
                "target": "#skill-runway-container"
            },
            "skills_python": {
                "text": "Yes, Python is one of my core strengths. I use it for Backend (FastAPI) and Logic (OR-Tools/NLP).",
                "action": "scroll_to",
                "label": "See Python Work",
                "target": "#work"
            },
            "skills_java": {
                "text": "I am proficient in Java, specifically for Data Structures & Algorithms and Object-Oriented design.",
                "action": "scroll_to",
                "label": "View Certifications",
                "target": "#certifications"
            },
            "skills_web": {
                "text": "I specialize in Full Stack Development using React for frontend and FastAPI/Node for backend.",
                "action": "scroll_to",
                "label": "View Web Projects",
                "target": "#work"
            },
            "work": {
                "text": "I have engineered advanced systems like SmartFlex (Scheduler), Human-Like CMS, and high-fidelity UIs like Sonic.",
                "action": "scroll_to",
                "label": "Browse Projects",
                "target": "#work"
            },
            
            # --- SMART PROJECT REDIRECTION ---
            "smartflex": {
                "text": "SmartFlex is an intelligent academic scheduling system built with Python OR-Tools and React. It solves NP-hard scheduling problems.",
                "action": "navigate_project",
                "label": "View SmartFlex",
                "target": "smartflex" # This ID matches data-id in HTML
            },
            "hcm": {
                "text": "The Human-Like Content Manager (HCM) is an AI-driven engine that understands context, tone, and intent to manage content naturally.",
                "action": "navigate_project",
                "label": "View HCM",
                "target": "human-cms" # Matches data-id in HTML
            },
            "spotify": {
                "text": "Sonic UI is a pixel-perfect Spotify clone focusing on DOM manipulation, audio state management, and responsive design.",
                "action": "navigate_project",
                "label": "View Sonic UI",
                "target": "spotify" # Matches data-id in HTML
            },

            "contact": {
                "text": "You can reach me at +91 82877 57838 or via email at avi40973@gmail.com. I'm open to opportunities.",
                "action": "offer_contact",
                "label": "Open Contact Form",
                "target": "open-contact-modal"
            }
        }
        
        # Fallback for specific skill queries that map to general skills
        if intent.startswith("skills_"):
            return responses.get("skills") if intent not in responses else responses.get(intent)

        return responses.get(intent, {
            "text": "I have information on that, but I need to locate the exact module.",
            "action": "scroll_to",
            "label": "Go to Home",
            "target": "#home"
        })