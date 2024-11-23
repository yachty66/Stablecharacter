import gradio as gr
from llm_arxiv import call_llm_arxiv

def chat_response(message, history):
    """
    Chat response function using LLM API
    """
    # Prepare the conversation history for the LLM
    messages = []
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    
    # Add the current message
    messages.append({"role": "user", "content": message})
    
    # Get response from LLM
    response = call_llm_arxiv(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.0  # Adjust temperature as needed
    )
    
    # Extract the assistant's response
    bot_message = response.choices[0].message.content
    
    # Add messages to history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": bot_message})

    return "", history
# Create the Gradio interface
with gr.Blocks() as demo:
    # Create chat components
    chatbot = gr.Chatbot(
        value=[],
        type="messages",
        bubble_full_width=False,
    )
    
    # Input textbox
    msg = gr.Textbox(
        label="Type your message here...",
        placeholder="Enter your message and press enter",
    )
    
    # Clear button
    clear = gr.ClearButton([msg, chatbot])
    
    # Handle message submission
    msg.submit(
        chat_response,
        inputs=[msg, chatbot],
        outputs=[msg, chatbot],
    )

# Launch the app
if __name__ == "__main__":
    demo.launch()