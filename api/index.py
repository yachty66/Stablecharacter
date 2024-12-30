from fastapi import FastAPI, Body
from .llm import call_llm_arxiv

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.post("/api/py/message_response")
async def message_response(messages = Body(...)):
    # Convert the chat history to OpenAI format
    formatted_messages = []
    for msg in messages:
        role = "user" if msg["isUser"] else "assistant"
        formatted_messages.append({
            "role": role,
            "content": msg["text"]
        })
    
    # Call the LLM
    try:
        response = call_llm_arxiv(messages=formatted_messages)
        return {"message": response.choices[0].message.content}
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return {"message": "Sorry, there was an error processing your request."}