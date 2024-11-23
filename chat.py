import gradio as gr
import json
from llm_arxiv import call_llm_arxiv

# Load the prompts
with open('prompts.json', 'r') as f:
    PERSONALITY_PROMPTS = json.load(f)

def chat_response(message, history, personality_type, name, gender, age, user_name, user_gender):
    """
    Chat response function using LLM API with personality
    """
    messages = []
    
    # Add the personality prompt as system message for every request
    system_prompt = PERSONALITY_PROMPTS[personality_type].format(
        name=name,
        gender=gender,
        age=age,
        user_name=user_name,
        user_gender=user_gender
    )
    messages.append({"role": "system", "content": system_prompt})
    
    # Add conversation history
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    
    # Add the current message
    messages.append({"role": "user", "content": message})
    
    # Get response from LLM
    response = call_llm_arxiv(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7
    )
    
    # Extract the assistant's response
    bot_message = response.choices[0].message.content
    
    # Add messages to history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": bot_message})

    print(20*"-")
    print("Full messages sent to LLM:", messages)  # Debug print to see full context
    print("History:", history)
    print(20*"-")
    
    return "", history

# Create the Gradio interface
with gr.Blocks() as demo:
    with gr.Row():
        with gr.Column(scale=1):
            # Character selection and metadata
            personality_type = gr.Dropdown(
                choices=list(PERSONALITY_PROMPTS.keys()),
                label="Select Personality Type",
                value="INTJ"
            )
            name = gr.Textbox(
                label="Character Name",
                placeholder="Enter character name"
            )
            gender = gr.Radio(
                choices=["Male", "Female", "Other"],
                label="Character Gender",
                value="Male"
            )
            age = gr.Slider(
                minimum=18,
                maximum=80,
                value=25,
                label="Character Age"
            )
            user_name = gr.Textbox(
                label="Your Name",
                placeholder="Enter your name"
            )
            user_gender = gr.Radio(
                choices=["Male", "Female", "Other"],
                label="Your Gender",
                value="Male"
            )
            
        with gr.Column(scale=2):
            # Chat interface
            chatbot = gr.Chatbot(
                value=[],
                type="messages",
                bubble_full_width=False,
            )
            msg = gr.Textbox(
                label="Type your message here...",
                placeholder="Enter your message and press enter",
            )
            clear = gr.ClearButton([msg, chatbot])
    
    # Handle message submission
    msg.submit(
        chat_response,
        inputs=[
            msg, 
            chatbot,
            personality_type,
            name,
            gender,
            age,
            user_name,
            user_gender
        ],
        outputs=[msg, chatbot],
    )

if __name__ == "__main__":
    demo.launch()