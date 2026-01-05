from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os

# IMPORT THE AI MODEL
from chat_model import ChatBotAI

# Initialize and Train AI
ai_bot = ChatBotAI()
ai_bot.train()

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI()

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Helper for paths
def get_static_path(filename):
    return os.path.join(STATIC_DIR, filename)

# Request Model for Chat
class ChatRequest(BaseModel):
    message: str

# =================================================================
# NEW API ROUTE FOR CHAT
# =================================================================
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    # Get response from our Python AI Model
    response_data = ai_bot.get_response(user_message)
    return JSONResponse(content=response_data)

# =================================================================
# EXISTING ROUTES
# =================================================================
@app.get("/")
async def read_root():
    return FileResponse(get_static_path("index.html"))

@app.get("/styles.css")
async def get_css():
    return FileResponse(get_static_path("styles.css"))

@app.get("/chatbot.css")
async def get_chat_css():
    return FileResponse(get_static_path("chatbot.css"))

@app.get("/script.js")
async def get_js():
    return FileResponse(get_static_path("script.js"))

@app.get("/chatbot.js")
async def get_chat_js():
    return FileResponse(get_static_path("chatbot.js"))

@app.get("/smartflex.html")
async def get_smartflex():
    return FileResponse(get_static_path("smartflex.html"))

@app.get("/smartflex.css")
async def get_smartflex_css():
    return FileResponse(get_static_path("smartflex.css"))

@app.get("/smartflex.js")
async def get_smartflex_js():
    return FileResponse(get_static_path("smartflex.js"))

# Fallback
@app.get("/{filename}")
async def read_file(filename: str):
    file_path = get_static_path(filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": f"File '{filename}' not found"}