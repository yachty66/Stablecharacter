#need to create personality 
#this is going to be so much fun lol.
#i can contactc dozens of influencers to make advertisement for me. can scale rt
#should be able to push out the mvp tonight 
#can make a channel with feature requests
#next i need to check if the discord works
'''
self.messages = [
            {
                "role": "system",
                "content": (
                    "We are playing a chess game. At every turn, repeat all the moves that have already been made."
                    "Find the best response for Black. I'm White and the game starts with 1.{first_move}\n\n"
                    "So, to be clear, your output format should always be:\n\n"
                    "PGN of game so far: ...\n\n"
                    "Best move: ...\n\n"
                    "and then I get to play my move. Do not include the move number'."
                ),
            }
        ]
        
completion = openai.ChatCompletion.create(model=self.model, messages=messages)

# Note: you need to be using OpenAI Python v0.27.0 for the code below to work
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
)

'''
import json
import openai

class Personality():
    def __init__(self, name, age, gender, type, user_name, user_gender):
        self.name = name
        self.age = age
        self.gender = gender
        self.type = type
        self.user_name = user_name
        self.user_gender = user_gender
        self.api_key = "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"
        self.messages = []
        #self.chat()
        
    def chat(self, message):
        with open('prompts.json') as f:
            data = json.load(f)
        value = data[self.type]
        value = value.replace('{name}', self.name)
        value = value.replace('{age}', self.age)
        value = value.replace("{gender}", self.gender)
        value = value.replace("{type}", self.type)
        value = value.replace("{user_name}", self.user_name)
        value = value.replace("{user_gender}", self.user_gender)
        
        if not self.messages:
            self.messages = [
                {"role": "system", "content": value},
                {"role": "user", "content": message},
            ]
        else:
            self.messages.append({"role": "user", "content": message})
            openai.api_key = self.api_key
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=self.messages
            )
            response = completion.choices[0].message["content"]
            self.messages.append({"role": "assistant", "content": response})  # Append assistant's response
            #print(completion.choices[0].message["content"])    
        
#instance = Personality("manfred", "20", "male", "Activist", "alfred", "male")
        