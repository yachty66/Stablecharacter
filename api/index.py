from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .llm import call_llm
import json
import os

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Load characters from JSON file
with open(os.path.join(os.path.dirname(__file__), 'characters.json'), 'r') as f:
    CHARACTERS = json.load(f)
    print("Loaded characters:", list(CHARACTERS.keys()))  # Debug log

class Message(BaseModel):
    text: str
    isUser: bool

class MessageRequest(BaseModel):
    messages: list[Message]
    selectedCharacter: str

@app.post("/api/py/message_response")
async def message_response(request: MessageRequest):
    print("Received request:", request)  # Debug log
    
    try:
        # Get character data
        if request.selectedCharacter not in CHARACTERS:
            print(f"Character {request.selectedCharacter} not found in", list(CHARACTERS.keys()))  # Debug log
            raise HTTPException(status_code=404, detail=f"Character {request.selectedCharacter} not found")
        
        character = CHARACTERS[request.selectedCharacter]
        system_prompt = character["system_prompt"]
        print(f"Using character: {request.selectedCharacter}")  # Debug log
        
        # Format messages for LLM
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            role = "user" if msg.isUser else "assistant"
            formatted_messages.append({
                "role": role,
                "content": msg.text
            })
        
        print("Sending to LLM:", formatted_messages)  # Debug log
        response = call_llm(messages=formatted_messages)
        print("LLM response:", response)  # Debug log
        
        return {"message": response.choices[0].message.content}
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))