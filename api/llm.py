from litellm import completion
import os
from dotenv import load_dotenv

load_dotenv()

os.environ['GEMINI_API_KEY'] = os.getenv("GEMINI_API_KEY")

def call_llm_arxiv(model="gemini/gemini-1.5-flash", messages=[], max_tokens=None, temperature=0.0, response_format=None):
    response = completion(
        model=model, 
        messages=messages,
        temperature=temperature,
        response_format=response_format
    )
    return response


if __name__ == "__main__":
    response = call_llm_arxiv(messages=[{"role": "user", "content": "write code for saying hi from LiteLLM"}])
    print(response)