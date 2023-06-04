import discord
from discord import option
from personality import Personality
from discord import Embed
from discord.ext import commands
import openai
import json

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
#bot = commands.Bot(command_prefix="!")

class ChatBot:
    def __init__(self):
        self.is_processing = False
        self.register_commands()
        self.register_events()
        self.run()
        self.api_key = "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"

    def register_commands(self):
        @bot.slash_command(name="chat", guild_ids=[1114168386105131138])
        @option("user_name", str, description="Enter your name")
        @option("user_gender", int, description="Choose your gender", choices=[
            discord.OptionChoice(name="Male", value=1),
            discord.OptionChoice(name="Female", value=2)
        ])
        @option("user_age", int, description="Enter your age", min_value=18)
        @option("bot_name", str, description="Enter bot's name")
        @option("bot_age", int, description="Enter bot's age")
        @option("bot_gender", int, description="Choose bot's gender", choices=[
            discord.OptionChoice(name="Male", value=1),
            discord.OptionChoice(name="Female", value=2)
        ])
        @option("bot_personality", str, description="Choose bot's personality", choices=[
            discord.OptionChoice(name="INTJ", value="INTJ"),
            discord.OptionChoice(name="INTP", value="INTP"),
            discord.OptionChoice(name="ENTJ", value="ENTJ"),
            discord.OptionChoice(name="ENTP", value="ENTP"),
            discord.OptionChoice(name="INFJ", value="INFJ"),
            discord.OptionChoice(name="INFP", value="INFP"),
            discord.OptionChoice(name="ENFJ", value="ENFJ"),
            discord.OptionChoice(name="ENFP", value="ENFP"),
            discord.OptionChoice(name="ISTJ", value="ISTJ"),
            discord.OptionChoice(name="ISFJ", value="ISFJ"),
            discord.OptionChoice(name="ESTJ", value="ESTJ"),
            discord.OptionChoice(name="EFFJ", value="EFFJ"),
            discord.OptionChoice(name="ISTP", value="ISTP"),
            discord.OptionChoice(name="ISFP", value="ISFP"),
            discord.OptionChoice(name="ESTP", value="ESTP"),
            discord.OptionChoice(name="ESFP", value="ESFP")
        ])
        async def chat_command(ctx, user_name: str, user_gender: int, user_age: int, bot_name: str, bot_age: int, bot_gender: int, bot_personality: str):
            if ',' in user_name or ',' in bot_name:
                await ctx.respond("Commas are not allowed in user or bot names.")
                return
            user_gender_text = "Male" if user_gender == 1 else "Female"
            bot_gender_text = "Male" if bot_gender == 1 else "Female"
            response_text = f"Received your details! Name: {user_name}, Age: {user_age}, Gender: {user_gender_text}. I am {bot_name}, a {bot_age} year old {bot_gender_text} bot with a {bot_personality} personality."
            embed = Embed(title="ChatBot", description=response_text, color=0x00ff00)
            await ctx.respond(embed=embed)
            user_name = str(user_name)
            user_age = str(user_age)
            user_gender_text = str(user_gender_text)
            bot_name = str(bot_name)
            bot_age = str(bot_age)
            bot_gender_text = str(bot_gender_text)
            bot_personality = str(bot_personality)
            bot = Personality(bot_name, bot_age, bot_gender_text, bot_personality, user_name, user_gender_text)
            text_channel = ctx.channel
            thread = await text_channel.create_thread(name=f"{user_name}-{bot_name}-chat", type=discord.ChannelType.private_thread)
            await thread.add_user(ctx.author)
            first_message = f"user_name: {user_name}, user_age: {user_age}, user_gender: {user_gender_text}, bot_name: {bot_name}, bot_age: {bot_age}, bot_gender: {bot_gender}, bot_personality: {bot_personality}"
            #bot_response = bot.chat(first_message)
            await thread.send(first_message) 
            await thread.send(embed=embed)
    
    async def message_data(self, message):
        chat_history = await message.channel.history().flatten()
        second_oldest_messages = chat_history[-2:][0]
        print("chat history:")
        print(chat_history)
        print("second oldest messages:")
        print(second_oldest_messages.content)
        message_parts = second_oldest_messages.content.split(', ')
        values = {}
        for part in message_parts:
            key, value = part.split(': ')
            values[key] = value
        user_name = values['user_name']
        user_age = values['user_age']
        user_gender = values['user_gender']
        bot_name = values['bot_name']
        bot_age = values['bot_age']
        bot_gender = values['bot_gender']
        bot_personality = values['bot_personality']
        chat_list = []
        for msg in chat_history:
            chat_list.append({msg.author.name: msg.content})
        return chat_history, user_name, user_age, user_gender, bot_name, bot_age, bot_gender, bot_personality
                        
    async def message_response(self, message):
        chat_history, user_name, user_age, user_gender, bot_name, bot_age, bot_gender, bot_personality = await self.message_data(message)
        #first draft 
        with open('prompts.json') as f:
            data = json.load(f)
        #type seems to be unknown somehow
        value = data[bot_personality]
        value = value.replace('{name}', bot_name)
        value = value.replace('{age}', bot_age)
        value = value.replace("{gender}", bot_gender)
        value = value.replace("{type}", bot_personality)
        value = value.replace("{user_name}", user_name)
        value = value.replace("{user_gender}", user_gender)
        messages = [
            {"role": "system", "content": value},
        ]
        chat_history = chat_history[:-3]
        combined_chat_history = []
        for i, msg in enumerate(chat_history):
            if i > 0 and msg.author == chat_history[i - 1].author:
                combined_chat_history[-1][msg.author.name] += f" {msg.content}"
            else:
                combined_chat_history.append({msg.author.name: msg.content})
        combined_chat_history.reverse()  # Reverse the order of messages
        for msg in combined_chat_history:
            for author, content in msg.items():
                role = "user" if author == user_name else "assistant"
                messages.append({"role": role, "content": content})
        print("messages")
        print(messages)

    def register_events(self):
        @bot.event
        async def on_message(message):            
            if message.author == bot.user:
                print("bot send message")
                return    
            if self.is_processing:  # Add this condition to check if the bot is processing a message
                return
            if message.content.strip() != "":
                self.is_processing = True  # Set the variable to True before processing the message
                await self.message_response(message)
                self.is_processing = False  # Set the variable back to False after processing the message
            await message.channel.send("Hello World")
        
    def run(self):
        bot.run("MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U")
        
if __name__ == "__main__":
    ChatBot()

