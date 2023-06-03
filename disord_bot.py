import discord
from discord import option
from personality import Personality
from discord import Embed

bot = discord.Bot()

class ChatBot:
    def __init__(self):
        self.register_commands()
        self.register_events()
        self.run()

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
            
    def register_events(self):
        #
        @bot.event
        async def on_message(message):            
            if message.author == bot.user:
                print("bot send message")
                return
            await message.channel.send("Hello World")
        
    def run(self):
        bot.run("MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U")
        
if __name__ == "__main__":
    ChatBot()

