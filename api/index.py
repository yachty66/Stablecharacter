from fastapi import FastAPI, Body
from .llm import call_llm_arxiv
import json
import os

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Load character prompts
with open(os.path.join(os.path.dirname(__file__), 'characters.json'), 'r') as f:
    CHARACTERS = json.load(f)

@app.post("/api/py/message_response")
async def message_response(messages = Body(...)):
    # For now, hardcode INTP. Later we'll make this selectable
    character = CHARACTERS["intp"]
    
    # Convert the chat history to OpenAI format
    formatted_messages = [{"role": "system", "content": character["system_prompt"]}]
    
    for msg in messages:
        role = "user" if msg["isUser"] else "assistant"
        formatted_messages.append({
            "role": role,
            "content": msg["text"]
        })
    
    try:
        response = call_llm_arxiv(messages=formatted_messages)
        return {"message": response.choices[0].message.content}
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return {"message": "Sorry, there was an error processing your request."}