import discord
from discord import option
from discord import Embed
from discord.ext import commands
import openai
import json

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
openai.api_key = "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"

class ChatBot:
    def __init__(self):
        self.bot_name_meta = "bot1112555632546041896"
        self.is_processing = {}
        self.bot_gender = ""
        self.bot_mbti = ""
        self.color = 0x000000
        self.register_commands()
        self.register_events()
        self.run()
        
    def register_commands(self):
        @bot.slash_command(name="chat", description="Start a chat with a personality type", guild_ids=[1114168386105131138])
        @option("user_name", str, description="Enter your name")
        @option("user_gender", int, description="Choose your gender", choices=[
            discord.OptionChoice(name="Male", value=1),
            discord.OptionChoice(name="Female", value=2)
        ])
        @option("user_age", int, description="Enter your age", min_value=18)
        @option("mbti_name", str, description="Enter mbti's name")
        @option("mbti_age", int, description="Enter mbti's age")
        @option("mbti_gender", int, description="Choose mbti's gender", choices=[
            discord.OptionChoice(name="Male", value=1),
            discord.OptionChoice(name="Female", value=2)
        ])
        @option("mbti_personality", str, description="Choose mbti's personality", choices=[
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
            if ctx.channel.name != "chat-room":
                chat_room_channel = discord.utils.get(ctx.guild.channels, name="chat-room")
                await ctx.respond(f"This command can only be used in the {chat_room_channel.mention} channel.")
                return
            if ',' in user_name or ',' in bot_name:
                await ctx.respond("Commas are not allowed in user or bot names.")
                return
            user_gender = "Male" if user_gender == 1 else "Female"
            bot_gender = "Male" if bot_gender == 1 else "Female"
            response_text = f"Name: {user_name}, Age: {user_age}, Gender: {user_gender}. I am {bot_name}, a {bot_age} year old {bot_gender} mbti with a {bot_personality} personality."
            if "NT" in bot_personality:
                self.color = 0x886199
            elif "NF" in bot_personality:
                self.color = 0x32A474
            elif "STP" in bot_personality or "SFP" in bot_personality:
                self.color = 0xE4AE3A
            else:
                self.color = 0x4198B4
            embed = Embed(title=f"{bot_personality}-{bot_gender}", description=response_text, color=self.color)
            await ctx.respond(embed=embed)
            user_name = str(user_name)
            user_age = str(user_age)
            user_gender= str(user_gender)
            bot_name = str(bot_name)
            bot_age = str(bot_age)
            bot_gender = str(bot_gender)
            bot_personality = str(bot_personality)
            text_channel = ctx.channel
            thread = await text_channel.create_thread(name=f"{bot_personality}-{bot_gender}", type=discord.ChannelType.private_thread)
            await thread.add_user(ctx.author)
            first_message = f"user_name: {user_name}, user_age: {user_age}, user_gender: {user_gender}, bot_name: {bot_name}, bot_age: {bot_age}, bot_gender: {bot_gender}, bot_personality: {bot_personality}"
            await thread.send(first_message) 
            await thread.send(embed=embed)
    
    async def message_data(self, message):
        chat_history = await message.channel.history().flatten()
        second_oldest_messages = chat_history[-2:][0]
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
        self.bot_gender = bot_gender
        self.bot_mbti = bot_personality
        with open('prompts.json') as f:
            data = json.load(f)
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
        combined_chat_history.reverse()
        for msg in combined_chat_history:
            for author, content in msg.items():
                role = "user" if author == user_name else "assistant"
                messages.append({"role": role, "content": content})
        print("messages: ")
        print(messages)
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        response = completion.choices[0].message["content"]
        return response

    def register_events(self):
        @bot.event
        async def on_message(message):            
            if message.author == bot.user:
                return
            user_id = message.author.id
            if user_id not in self.is_processing:
                self.is_processing[user_id] = False
            
            if self.is_processing[user_id]:   
                return
            
            if message.content.strip() != "":
                self.is_processing[user_id] = True
                response = await self.message_response(message)
                embed_response = Embed(description=response, color=self.color)
                image_url = f"images_{self.bot_gender}s/{self.bot_mbti}.png"
                with open("image_map.json") as img_map_file:
                    image_map = json.load(img_map_file)
                image_key = self.bot_mbti + "_" + self.bot_gender
                image_url = image_map[image_key]
                embed_response.set_image(url=image_url)  
                await message.channel.send(embed=embed_response)
                self.is_processing[user_id] = False
        
    def run(self):
        bot.run("MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U")
        
if __name__ == "__main__":
    ChatBot()

