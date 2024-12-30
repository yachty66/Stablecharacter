from fastapi import FastAPI, Body

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.post("/api/py/message_response")
async def message_response(messages = Body(...)):
    print("Received messages:", messages)  # Debug print
    return {"message": "hello world"}


