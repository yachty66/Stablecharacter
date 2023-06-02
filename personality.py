#need to create personality 

#this is going to be so much fun lol.

#i can contactc dozens of influencers to make advertisement for me. can scale rt
#should be able to push out the mvp tonight 
#can make a channel with feature requests


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


'''
import json

class Personality():
    def __init__(self, name, age, gender, type, user_name, user_gender):
        self.name = name
        self.chat()
        
        
    def chat(self):
        #get the value from the json file prompts.json where the key is equals to self.name
        with open('prompts.json') as f:
            data = json.load(f)
        value = data[self.name]
        #insert at ht
        print(value)
        #defininbg openai chat here 
        pass
    
    
        
        
        