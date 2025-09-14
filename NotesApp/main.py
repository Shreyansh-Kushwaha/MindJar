from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")



# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.NotesApp
notes_collection = db.notes






@app.get("/")
def serve_home():
    return FileResponse("static/index.html")



class Note(BaseModel):
    title: str
    content: str

def note_helper(note) -> dict:
    return {
        "id" : str(note["_id"]),
        "title": note["title"],
        "content": note["content"]
    }

@app.post("/notes")
def create_note(note: Note):
    new_note = notes_collection.insert_one(note.dict())
    created_note = notes_collection.find_one({"_id": new_note.inserted_id})
    return note_helper(created_note)

@app.get("/notes")
def get_notes():
    notes = [note_helper(note) for note in notes_collection.find()]
    return notes

@app.put("/notes/{note_id}")
def update_note(note_id: str, note: Note):
    notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": note.dict()}
    )
    note = notes_collection.find_one({"_id": ObjectId(note_id)})
    return note_helper(note)

@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    result = notes_collection.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count:
        return {"message": "Note deleted"}
    return {"error": "Note not found"}


    
